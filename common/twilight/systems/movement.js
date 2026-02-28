module.exports = function(Twilight) {

  ////////////////////////////////////////////////////////////////////////////////
  // Movement

  // Returns true if this unit type can move independently (not transported).
  // Used by getMovementPreview and the UI for movement validation.
  Twilight.prototype.isMovableUnitType = function(playerName, unitType) {
    const unitDef = this._getUnitStats(playerName, unitType)
    if (!unitDef) {
      return false
    }
    // Ships that don't require capacity can move on their own
    // Saar Floating Factory: space docks with move > 0 move as ships
    return (unitDef.category === 'ship' && !unitDef.requiresCapacity)
    || (unitType === 'space-dock' && unitDef.move > 0)
  }

  // Returns a preview of what a set of proposed movements will accomplish.
  // Used by both the engine (for classification) and the UI (for validation).
  Twilight.prototype.getMovementPreview = function(playerName, targetSystemId, movements) {
    const shipMovements = []
    const transportedUnits = []

    for (const m of movements) {
      const unitDef = this._getUnitStats(playerName, m.unitType)
      if (!unitDef) {
        continue
      }

      if (this.isMovableUnitType(playerName, m.unitType)) {
        shipMovements.push(m)
      }
      else {
        transportedUnits.push(m)
      }
    }

    // Capacity from ships being moved to target
    let totalCapacity = 0
    for (const m of shipMovements) {
      const unitDef = this._getUnitStats(playerName, m.unitType)
      totalCapacity += (unitDef.capacity || 0) * m.count
    }

    // Capacity from player's ships already at target
    const targetUnits = this.state.units[targetSystemId]?.space || []
    for (const unit of targetUnits) {
      if (unit.owner === playerName) {
        const unitDef = this._getUnitStats(unit.owner, unit.type)
        if (unitDef && !unitDef.requiresCapacity) {
          totalCapacity += unitDef.capacity || 0
        }
      }
    }

    // Capacity already used by transported units at target
    let usedCapacity = 0
    for (const unit of targetUnits) {
      if (unit.owner === playerName) {
        const unitDef = this._getUnitStats(unit.owner, unit.type)
        if (unitDef?.requiresCapacity) {
          usedCapacity++
        }
      }
    }

    // Calculate how many of each transported unit type can actually move
    const player = this.players.byName(playerName)
    let capacityLeft = totalCapacity - usedCapacity
    const transportCounts = {}
    for (const m of transportedUnits) {
      const isExempt = this.factionAbilities.isCapacityExempt(player, m.unitType)
      if (isExempt) {
        transportCounts[m.unitType] = (transportCounts[m.unitType] || 0) + m.count
      }
      else {
        const canTransport = Math.max(0, Math.min(m.count, capacityLeft))
        transportCounts[m.unitType] = (transportCounts[m.unitType] || 0) + canTransport
        capacityLeft -= canTransport
      }
    }

    return {
      shipMovements,
      transportedUnits,
      totalCapacity,
      usedCapacity,
      availableCapacity: Math.max(0, totalCapacity - usedCapacity),
      transportCounts,
    }
  }

  Twilight.prototype._movementStep = function(player, targetSystemId) {
    const moveSelection = this.actions.choose(player, ['Done'], {
      title: 'Move Ships',
      allowsAction: 'move-ships',
    })

    if (moveSelection.action !== 'move-ships') {
      return
    }

    const movements = moveSelection.movements || []
    if (movements.length === 0) {
      return
    }

    const galaxy = new (require('../model/Galaxy.js').Galaxy)(this)

    // Classify movements using shared preview logic
    const preview = this.getMovementPreview(player.name, targetSystemId, movements)
    const { shipMovements, transportedUnits } = preview

    // Validate and execute ship movements
    const movedShips = []
    const movedShipPaths = []  // parallel array: path for each moved ship
    for (const m of shipMovements) {
      const fromSystemId = String(m.from)

      // Cannot move ships from a system with own command token (unless Dominus Orb active)
      if (!this.state._dominusOrbActive
        && this.state.systems[fromSystemId]?.commandTokens.includes(player.name)) {
        continue
      }

      const unitDef = this._getUnitStats(player.name, m.unitType)
      const moveBonus = this.factionAbilities.getMovementBonus(player.name, fromSystemId)
      // Gravity Drive: +1 movement for all ships
      const gravityDriveBonus = player.hasTechnology('gravity-drive') ? 1 : 0
      // Aetherstream: +1 movement for all ships during this tactical action
      const aetherstreamBonus = (this.state.currentTacticalAction?.aetherstreamBonus === player.name) ? 1 : 0
      // Captain Mendosa: override move value for one ship type
      const mendosa = this.state.currentTacticalAction?.mendosaBonus
      let baseMove = (mendosa && mendosa.playerName === player.name && mendosa.shipType === m.unitType)
        ? mendosa.moveValue
        : unitDef.move

      // Nebula: ships starting in a nebula have their move value set to 1 (Rule 59.2)
      const fromTile = galaxy.getSystemTile(fromSystemId)
      if (fromTile?.anomaly === 'nebula') {
        const movingPlayer = this.players.byName(player.name)
        if (!movingPlayer || !this._hasRelic?.(movingPlayer, 'circlet-of-the-void')) {
          baseMove = 1
        }
      }

      // The Table's Grace: Mentak cruisers can move through enemy systems
      // when the active system contains opponent non-fighter ships
      if (m.unitType === 'cruiser' && player.hasTechnology('the-tables-grace')) {
        const destUnits = this.state.units[targetSystemId]
        const enemyNonFighters = destUnits
          ? destUnits.space.filter(u => u.owner !== player.name && u.type !== 'fighter')
          : []
        if (enemyNonFighters.length > 0) {
          this.state._tablesGraceActive = true
        }
      }

      // Void Tether: set context for adjacency check during pathfinding
      if (this.state.voidTetherTokens?.length > 0) {
        this.state._voidTetherCheckPlayer = player.name
      }
      const path = galaxy.findPath(fromSystemId, targetSystemId, player.name, baseMove + moveBonus + gravityDriveBonus + aetherstreamBonus)
      delete this.state._tablesGraceActive
      delete this.state._voidTetherCheckPlayer
      if (!path) {
        continue  // Ship cannot reach the target
      }

      // Move units (up to count)
      const systemUnits = this.state.units[fromSystemId]
      if (!systemUnits) {
        continue
      }

      for (let i = 0; i < m.count; i++) {
        const unitIdx = systemUnits.space.findIndex(
          u => u.owner === player.name && u.type === m.unitType
        )
        if (unitIdx === -1) {
          break
        }

        const unit = systemUnits.space.splice(unitIdx, 1)[0]
        this.state.units[targetSystemId].space.push(unit)
        movedShips.push(unit)
        movedShipPaths.push(path)
      }
    }

    // Gravity Rift die roll: ships passing through or out of a gravity rift
    // roll 1d10; on 1-3 the ship is removed (not destroyed) (Rule 41.2)
    const movingPlayer = this.players.byName(player.name)
    const hasCirclet = movingPlayer && this._hasRelic?.(movingPlayer, 'circlet-of-the-void')
    if (!hasCirclet) {
      for (let i = movedShips.length - 1; i >= 0; i--) {
        const shipPath = movedShipPaths[i]
        // Check if any system in path (excluding destination) is a gravity rift
        const passedThroughRift = shipPath.slice(0, -1).some(sysId => {
          const tile = galaxy.getSystemTile(sysId)
          return tile?.anomaly === 'gravity-rift'
        })
        if (!passedThroughRift) {
          continue
        }

        const roll = Math.floor(this.random() * 10) + 1
        if (roll <= 3) {
          const ship = movedShips[i]
          const idx = this.state.units[targetSystemId].space.findIndex(u => u.id === ship.id)
          if (idx !== -1) {
            this.state.units[targetSystemId].space.splice(idx, 1)
            this.log.add({
              template: '{player} loses a {unit} to gravity rift (rolled {roll})',
              args: { player, unit: ship.type, roll },
            })
          }
          movedShips.splice(i, 1)
          movedShipPaths.splice(i, 1)
        }
      }
    }

    // Check fleet pool limit (non-fighter ships in target system)
    const fleetLimit = this._getFleetLimit(player)
    const nonFighterShips = this.state.units[targetSystemId].space
      .filter(u => u.owner === player.name && u.type !== 'fighter')
    if (nonFighterShips.length > fleetLimit) {
    // Remove excess ships (return to origin — for now, just remove the last moved)
      const excess = nonFighterShips.length - fleetLimit
      for (let i = 0; i < excess; i++) {
        const lastMoved = movedShips.pop()
        if (lastMoved && lastMoved.type !== 'fighter') {
          const idx = this.state.units[targetSystemId].space.findIndex(u => u.id === lastMoved.id)
          if (idx !== -1) {
            this.state.units[targetSystemId].space.splice(idx, 1)
            // Return to origin — find origin from movements
            const origin = shipMovements.find(m => m.unitType === lastMoved.type)?.from
            if (origin) {
              this.state.units[String(origin)].space.push(lastMoved)
            }
          }
        }
      }
    }

    // Calculate total transport capacity of ships in target system
    let totalCapacity = 0
    for (const unit of this.state.units[targetSystemId].space) {
      if (unit.owner === player.name) {
        const unitDef = this._getUnitStats(unit.owner, unit.type)
        if (unitDef) {
          totalCapacity += unitDef.capacity || 0
        }
      }
    }

    // Count units already being transported (fighters + ground forces already in system)
    let usedCapacity = 0
    for (const unit of this.state.units[targetSystemId].space) {
      if (unit.owner === player.name) {
        const unitDef = this._getUnitStats(unit.owner, unit.type)
        if (unitDef?.requiresCapacity) {
          usedCapacity++
        }
      }
    }

    // Transport units (fighters and ground forces go to space area — in transit)
    for (const m of transportedUnits) {
      const fromSystemId = String(m.from)
      const unitDef = this._getUnitStats(player.name, m.unitType)
      if (!unitDef) {
        continue
      }

      const systemUnits = this.state.units[fromSystemId]
      if (!systemUnits) {
        continue
      }

      const isExempt = this.factionAbilities.isCapacityExempt(player, m.unitType)
      for (let i = 0; i < m.count; i++) {
        if (!isExempt && usedCapacity >= totalCapacity) {
          break  // No more capacity
        }

        // Find the unit in the from system (check space for fighters, planets for ground forces)
        let unit = null
        if (unitDef.category === 'ship') {
        // Fighters are in space
          const idx = systemUnits.space.findIndex(
            u => u.owner === player.name && u.type === m.unitType
          )
          if (idx !== -1) {
            unit = systemUnits.space.splice(idx, 1)[0]
          }
        }
        else if (unitDef.category === 'ground') {
        // Ground forces are on planets
          for (const planetId of Object.keys(systemUnits.planets)) {
            const idx = systemUnits.planets[planetId].findIndex(
              u => u.owner === player.name && u.type === m.unitType
            )
            if (idx !== -1) {
              unit = systemUnits.planets[planetId].splice(idx, 1)[0]
              break
            }
          }
        }

        if (!unit) {
          break
        }

        // All transported units go to space area (in transit)
        this.state.units[targetSystemId].space.push(unit)
        // Capacity-exempt units (e.g., Argent Aerie Sentinel mech) don't count
        if (!isExempt) {
          usedCapacity++
        }
      }
    }

    if (movedShips.length > 0 || transportedUnits.length > 0) {
      this.log.add({
        template: '{player} moves ships to system {system}',
        args: { player, system: targetSystemId },
      })
    }
  }

} // module.exports
