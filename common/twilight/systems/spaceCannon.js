const res = require('../res/index.js')

// Snapshot roll data to plain objects (strips live unit refs)
function _mapRolls(rollResult) {
  return rollResult.rolls.map(r => ({
    unitType: r.ship.type,
    unitId: r.ship.id,
    owner: r.ship.owner,
    effectiveCombat: r.effectiveCombat,
    dice: r.diceResults.map(d => ({ roll: d.roll, hit: d.hit })),
  }))
}

module.exports = function(Twilight) {

  ////////////////////////////////////////////////////////////////////////////////
  // Space Cannon

  /**
 * Space Cannon Offense — fires after movement, before space combat.
 * PDS units in the active system fire at the active player's ships.
 * PDS II (upgraded) can also fire from adjacent systems.
 */
  Twilight.prototype._spaceCannonOffense = function(activePlayer, systemId) {
    const systemUnits = this.state.units[systemId]
    if (!systemUnits) {
      return
    }

    // Check if the active player has any ships in the system
    const activeShips = systemUnits.space.filter(u => u.owner === activePlayer.name)
    if (activeShips.length === 0) {
      return
    }

    // Collect all PDS that can fire at this system
    let totalHits = 0
    const plasmaUsedByOwner = {}  // Plasma Scoring: track per-owner first-unit bonus
    const commanderBonusUsedByOwner = {}  // Commander bonus: track per-owner first-unit bonus
    const missesByOwner = {}  // Jol-Nar Commander: track misses per owner for rerolls
    const firingOwners = new Set()  // Track all owners who fired (for onUnitDestroyed hooks)
    // Antimass Deflectors: +1 combat value when firing at target with this tech
    const antimassDefense = activePlayer.hasTechnology('antimass-deflectors') ? 1 : 0
    const rollInfo = { rolls: [], combatValues: new Set() }

    // 1. PDS in the active system (on planets) belonging to non-active players
    const tile = res.getSystemTile(systemId) || res.getSystemTile(Number(systemId))
    if (tile) {
      for (const planetId of tile.planets) {
        const planetUnits = systemUnits.planets[planetId] || []
        for (const unit of planetUnits) {
          if (unit.owner === activePlayer.name || unit.type !== 'pds') {
            continue
          }
          // Plasma Scoring: +1 die for first space cannon unit per owner
          let extraDice = 0
          if (!plasmaUsedByOwner[unit.owner]) {
            const owner = this.players.byName(unit.owner)
            if (owner && owner.hasTechnology('plasma-scoring')) {
              extraDice = 1
              plasmaUsedByOwner[unit.owner] = true
            }
          }
          // Commander bonus: +N dice for first unit ability per owner
          if (!commanderBonusUsedByOwner[unit.owner]) {
            const bonus = this.factionAbilities.getUnitAbilityBonusDice(unit.owner)
            if (bonus > 0) {
              extraDice += bonus
              commanderBonusUsedByOwner[unit.owner] = true
            }
          }
          if (!missesByOwner[unit.owner]) {
            missesByOwner[unit.owner] = []
          }
          firingOwners.add(unit.owner)
          totalHits += this._fireSpaceCannon(unit.owner, unit.type, extraDice, antimassDefense, missesByOwner[unit.owner], rollInfo)
        }
      }
    }

    // 1b. Hero attachments with space cannon abilities (e.g., Titans Geoform on Elysium)
    if (this.state.heroAttachments && tile) {
      for (const planetId of tile.planets) {
        const attachment = this.state.heroAttachments[planetId]
        if (!attachment?.spaceCannonAbility) {
          continue
        }
        // Find the planet controller (the one who benefits from the attachment)
        const controller = this.state.planets[planetId]?.controller
        if (!controller || controller === activePlayer.name) {
          continue
        }
        // Fire the space cannon from the hero attachment
        const parts = attachment.spaceCannonAbility.replace('space-cannon-', '').split('x')
        const combatValue = Math.min(10, parseInt(parts[0]) + antimassDefense)
        const diceCount = parseInt(parts[1] || 1)
        let extraDice = 0
        if (!plasmaUsedByOwner[controller]) {
          const owner = this.players.byName(controller)
          if (owner && owner.hasTechnology('plasma-scoring')) {
            extraDice = 1
            plasmaUsedByOwner[controller] = true
          }
        }
        firingOwners.add(controller)
        rollInfo.combatValues.add(combatValue)
        for (let i = 0; i < diceCount + extraDice; i++) {
          const roll = Math.floor(this.random() * 10) + 1
          rollInfo.rolls.push(roll)
          if (roll >= combatValue) {
            totalHits++
          }
        }
      }
    }

    // 1c. Custodia Vigilia: SPACE CANNON 5 from Mecatol Rex system (IIHQ Modernization)
    if (this.state.iihqModernization) {
      const cvOwner = this.state.iihqModernization.owner
      if (cvOwner !== activePlayer.name && this.state.planets['custodia-vigilia']?.controller === cvOwner) {
        const mecatolSystem = '18'
        const isInOrAdjacentToMecatol = systemId === mecatolSystem
          || this._getAdjacentSystems(mecatolSystem).includes(String(systemId))
        if (isInOrAdjacentToMecatol) {
          const owner = this.players.byName(cvOwner)
          if (owner) {
            let extraDice = 0
            if (!plasmaUsedByOwner[cvOwner] && owner.hasTechnology('plasma-scoring')) {
              extraDice = 1
              plasmaUsedByOwner[cvOwner] = true
            }
            if (!commanderBonusUsedByOwner[cvOwner]) {
              const bonus = this.factionAbilities.getUnitAbilityBonusDice(cvOwner)
              if (bonus > 0) {
                extraDice += bonus
                commanderBonusUsedByOwner[cvOwner] = true
              }
            }
            if (!missesByOwner[cvOwner]) {
              missesByOwner[cvOwner] = []
            }
            firingOwners.add(cvOwner)
            // Space Cannon 5, 1 die
            const combatValue = Math.min(10, 5 + antimassDefense)
            const diceCount = 1 + extraDice
            rollInfo.combatValues.add(combatValue)
            for (let i = 0; i < diceCount; i++) {
              const roll = Math.floor(this.random() * 10) + 1
              rollInfo.rolls.push(roll)
              if (roll >= combatValue) {
                totalHits++
              }
              else {
                missesByOwner[cvOwner].push(combatValue)
              }
            }
          }
        }
      }
    }

    // 2. PDS II in adjacent systems (check if owner has PDS II upgrade)
    const adjacentSystems = this._getAdjacentSystems(systemId)
    for (const adjSystemId of adjacentSystems) {
      const adjSystemUnits = this.state.units[adjSystemId]
      if (!adjSystemUnits) {
        continue
      }
      const adjTile = res.getSystemTile(adjSystemId) || res.getSystemTile(Number(adjSystemId))
      if (!adjTile) {
        continue
      }

      for (const adjPlanetId of adjTile.planets) {
        const adjPlanetUnits = adjSystemUnits.planets[adjPlanetId] || []
        for (const unit of adjPlanetUnits) {
          if (unit.owner === activePlayer.name || unit.type !== 'pds') {
            continue
          }
          // Only PDS II can fire into adjacent systems
          const unitStats = this._getUnitStats(unit.owner, unit.type)
          if (!unitStats) {
            continue
          }
          const scAbility = (unitStats.abilities || []).find(a => a.startsWith('space-cannon-'))
          if (!scAbility) {
            continue
          }
          // PDS II has space-cannon-5x1; base PDS has space-cannon-6x1
          // Check if owner has pds-ii technology or faction equivalent (e.g., Hel-Titan II)
          const owner = this.players.byName(unit.owner)
          const canFireAdjacent = owner && (
            owner.hasTechnology('pds-ii') ||
          this.factionAbilities._getPlayerHandler(owner)?.canFireSpaceCannonFromAdjacentSystem?.(owner, this.factionAbilities)
          )
          if (canFireAdjacent) {
            let extraDice = 0
            if (!plasmaUsedByOwner[unit.owner] && owner.hasTechnology('plasma-scoring')) {
              extraDice = 1
              plasmaUsedByOwner[unit.owner] = true
            }
            // Commander bonus: +N dice for first unit ability per owner
            if (!commanderBonusUsedByOwner[unit.owner]) {
              const bonus = this.factionAbilities.getUnitAbilityBonusDice(unit.owner)
              if (bonus > 0) {
                extraDice += bonus
                commanderBonusUsedByOwner[unit.owner] = true
              }
            }
            if (!missesByOwner[unit.owner]) {
              missesByOwner[unit.owner] = []
            }
            firingOwners.add(unit.owner)
            totalHits += this._fireSpaceCannon(unit.owner, unit.type, extraDice, antimassDefense, missesByOwner[unit.owner], rollInfo)
          }
        }
      }
    }

    // Jol-Nar Commander: reroll misses per owner
    for (const [ownerName, misses] of Object.entries(missesByOwner)) {
      totalHits += this._offerUnitAbilityReroll(ownerName, misses)
    }

    // Graviton Laser System: auto-exhaust to force hits onto non-fighter ships
    let gravitonActive = false
    for (const firingOwner of Object.keys(plasmaUsedByOwner).concat(
    // Also check owners who fired but didn't have plasma
      tile ? tile.planets.flatMap(pId =>
        (systemUnits.planets[pId] || [])
          .filter(u => u.owner !== activePlayer.name && u.type === 'pds')
          .map(u => u.owner)
      ) : []
    )) {
      const fp = this.players.byName(firingOwner)
      if (fp && this._isTechReady(fp, 'graviton-laser-system')) {
        this._exhaustTech(fp, 'graviton-laser-system')
        gravitonActive = true
        break
      }
    }

    if (totalHits > 0) {
      this.log.add({
        template: 'Space Cannon Offense scores {hits} hit(s) against {player}',
        args: { hits: totalHits, player: activePlayer },
      })
      if (rollInfo.rolls.length > 0) {
        this.log.indent()
        const scoThresholds = [...rollInfo.combatValues].sort((a, b) => a - b).map(t => `${t}+`).join('/')
        let scoDetail = `Rolls: ${rollInfo.rolls.join(', ')} (need ${scoThresholds})`
        if (Object.keys(plasmaUsedByOwner).length > 0) {
          scoDetail += ', Plasma Scoring: +1 die'
        }
        if (Object.keys(commanderBonusUsedByOwner).length > 0) {
          scoDetail += ', Commander: +1 die'
        }
        if (antimassDefense > 0) {
          scoDetail += ', Antimass Deflectors: +1 to combat value'
        }
        this.log.add({ template: scoDetail, args: {} })
        this.log.outdent()
      }

      // Check if active player had non-fighter ships before SCO (for turn-their-fleets-to-dust)
      const hadNonFighters = activeShips.some(u => u.type !== 'fighter')

      // Active player assigns hits to their ships
      const shooterName = [...firingOwners][0] || null
      this._assignSpaceCannonHits(systemId, activePlayer.name, totalHits, gravitonActive, shooterName)

      // turn-their-fleets-to-dust: all non-fighter ships destroyed by space cannon offense
      if (hadNonFighters) {
        const remainingNonFighters = systemUnits.space.filter(
          u => u.owner === activePlayer.name && u.type !== 'fighter'
        )
        if (remainingNonFighters.length === 0) {
        // Credit to all PDS owners who fired
          const pdsOwners = new Set()
          if (tile) {
            for (const pId of tile.planets) {
              for (const u of (systemUnits.planets[pId] || [])) {
                if (u.owner !== activePlayer.name && u.type === 'pds') {
                  pdsOwners.add(u.owner)
                }
              }
            }
          }
          for (const owner of pdsOwners) {
            this._recordSecretTrigger(owner, 'turn-their-fleets-to-dust')
          }
        }
      }
    }
  }

  /**
 * Space Cannon Defense — fires during invasion, before ground combat.
 * PDS and units with Space Cannon ability on the planet fire at invading ground forces.
 */
  Twilight.prototype._spaceCannonDefense = function(systemId, planetId, attackerName) {
    const systemUnits = this.state.units[systemId]
    if (!systemUnits) {
      return
    }

    // L4 Disruptors: units cannot use Space Cannon against invading player's units
    const attackerPlayer = this.players.byName(attackerName)
    if (attackerPlayer && this.factionAbilities.isSpaceCannonImmuneDuringInvasion(attackerPlayer)) {
      this.log.add({
        template: 'L4 Disruptors: Space Cannon Defense cannot fire against {attacker}',
        args: { attacker: attackerName },
      })
      return
    }

    const defenderName = this.state.planets[planetId]?.controller
    if (!defenderName) {
      return
    }

    // Find ground forces in space (not yet committed)
    const groundForcesInSpace = systemUnits.space
      .filter(u => u.owner === attackerName && res.getUnit(u.type)?.category === 'ground')

    if (groundForcesInSpace.length === 0) {
      return
    }

    // Fire space cannon from defender's PDS and other units with space cannon on this planet
    let totalHits = 0
    const defMisses = []
    const planetUnits = systemUnits.planets[planetId] || []
    let defenderPlasmaUsed = false
    let defenderCommanderBonusUsed = false
    // Antimass Deflectors: +1 combat value when firing at target with this tech
    const antimassDefense = attackerPlayer && attackerPlayer.hasTechnology('antimass-deflectors') ? 1 : 0
    const defRollInfo = { rolls: [], combatValues: new Set() }

    for (const unit of planetUnits) {
      if (unit.owner !== defenderName) {
        continue
      }
      const unitStats = this._getUnitStats(unit.owner, unit.type)
      if (!unitStats) {
        continue
      }
      const scAbility = (unitStats.abilities || []).find(a => a.startsWith('space-cannon-'))
      if (scAbility) {
      // Plasma Scoring: +1 die for first space cannon unit
        let extraDice = 0
        if (!defenderPlasmaUsed) {
          const defender = this.players.byName(defenderName)
          if (defender && defender.hasTechnology('plasma-scoring')) {
            extraDice = 1
            defenderPlasmaUsed = true
          }
        }
        // Commander bonus: +N dice for first unit ability
        if (!defenderCommanderBonusUsed) {
          const bonus = this.factionAbilities.getUnitAbilityBonusDice(defenderName)
          if (bonus > 0) {
            extraDice += bonus
            defenderCommanderBonusUsed = true
          }
        }
        totalHits += this._fireSpaceCannon(unit.owner, unit.type, extraDice, antimassDefense, defMisses, defRollInfo)
      }
    }

    // Custodia Vigilia: SPACE CANNON 5 defense on Mecatol Rex system
    if (this.state.iihqModernization && systemId === '18') {
      const cvOwner = this.state.iihqModernization.owner
      if (cvOwner === defenderName && this.state.planets['custodia-vigilia']?.controller === cvOwner) {
        let extraDice = 0
        if (!defenderPlasmaUsed) {
          const defender = this.players.byName(defenderName)
          if (defender && defender.hasTechnology('plasma-scoring')) {
            extraDice = 1
            defenderPlasmaUsed = true
          }
        }
        if (!defenderCommanderBonusUsed) {
          const bonus = this.factionAbilities.getUnitAbilityBonusDice(defenderName)
          if (bonus > 0) {
            extraDice += bonus
            defenderCommanderBonusUsed = true
          }
        }
        // Space Cannon 5, 1 die
        const combatValue = Math.min(10, 5 + antimassDefense)
        const diceCount = 1 + extraDice
        defRollInfo.combatValues.add(combatValue)
        for (let i = 0; i < diceCount; i++) {
          const roll = Math.floor(this.random() * 10) + 1
          defRollInfo.rolls.push(roll)
          if (roll >= combatValue) {
            totalHits++
          }
          else {
            defMisses.push(combatValue)
          }
        }
      }
    }

    // Jol-Nar Commander: reroll misses
    totalHits += this._offerUnitAbilityReroll(defenderName, defMisses)

    if (totalHits > 0) {
      this.log.add({
        template: 'Space Cannon Defense scores {hits} hit(s) against {attacker} on {planet}',
        args: { hits: totalHits, attacker: attackerName, planet: planetId },
      })
      if (defRollInfo.rolls.length > 0) {
        this.log.indent()
        const scdThresholds = [...defRollInfo.combatValues].sort((a, b) => a - b).map(t => `${t}+`).join('/')
        let scdDetail = `Rolls: ${defRollInfo.rolls.join(', ')} (need ${scdThresholds})`
        if (defenderPlasmaUsed) {
          scdDetail += ', Plasma Scoring: +1 die'
        }
        if (defenderCommanderBonusUsed) {
          scdDetail += ', Commander: +1 die'
        }
        if (antimassDefense > 0) {
          scdDetail += ', Antimass Deflectors: +1 to combat value'
        }
        this.log.add({ template: scdDetail, args: {} })
        this.log.outdent()
      }

      // Hits are assigned to ground forces in space (before they commit)
      // Auto-assign to cheapest ground forces
      this._assignGroundForcesInSpaceHits(systemId, attackerName, totalHits, defenderName)
    }
  }

  /**
 * Roll space cannon dice for a single unit.
 * Returns number of hits scored.
 */
  Twilight.prototype._fireSpaceCannon = function(ownerName, unitType, extraDice, combatPenalty, misses, rollInfo) {
    const unitStats = this._getUnitStats(ownerName, unitType)
    if (!unitStats) {
      return 0
    }

    const scAbility = (unitStats.abilities || []).find(a => a.startsWith('space-cannon-'))
    if (!scAbility) {
      return 0
    }

    // Parse space-cannon-NxD where N is combat value, D is dice count
    const parts = scAbility.replace('space-cannon-', '').split('x')
    // Antimass Deflectors: +1 to combat value (harder to hit)
    const combatValue = Math.min(10, parseInt(parts[0]) + (combatPenalty || 0))
    const diceCount = parseInt(parts[1]) + (extraDice || 0)

    let hits = 0
    for (let i = 0; i < diceCount; i++) {
      const roll = Math.floor(this.random() * 10) + 1
      if (rollInfo) {
        rollInfo.rolls.push(roll)
      }
      if (roll >= combatValue) {
        hits++
      }
      else if (misses) {
        misses.push(combatValue)
      }
    }
    if (rollInfo) {
      rollInfo.combatValues.add(combatValue)
    }
    return hits
  }

  /**
 * Assign space cannon offense hits to ships in the system.
 * Auto-assign cheapest first for now.
 */
  Twilight.prototype._assignSpaceCannonHits = function(systemId, ownerName, hits, gravitonActive, destroyerName) {
    const systemUnits = this.state.units[systemId]
    if (!systemUnits || hits <= 0) {
      return
    }

    // Allow faction abilities to cancel hits (e.g., Titans agent Tellurian)
    let remaining = this.factionAbilities.onHitsProduced(ownerName, systemId, hits, 'space-cannon')
    if (remaining <= 0) {
      return
    }

    // Graviton Laser System: hits must target non-fighter ships
    const shipFilter = gravitonActive
      ? (u => u.owner === ownerName && u.type !== 'fighter')
      : (u => u.owner === ownerName)

    // Find ships that can sustain damage first
    const ownerShips = systemUnits.space.filter(shipFilter)

    // Sort: cheapest first (destroy cheap ships before expensive ones)
    const costOrder = ownerShips.sort((a, b) => {
      const aDef = this._getUnitStats(a.owner, a.type)
      const bDef = this._getUnitStats(b.owner, b.type)
      return (aDef?.cost || 0) - (bDef?.cost || 0)
    })

    // Check for sustain damage on undamaged units first
    for (const ship of costOrder) {
      if (remaining <= 0) {
        break
      }
      const def = this._getUnitStats(ship.owner, ship.type)
      if (def && def.abilities.includes('sustain-damage') && !ship.damaged) {
        ship.damaged = true
        remaining--
      }
    }

    // Destroy remaining
    for (let i = costOrder.length - 1; i >= 0 && remaining > 0; i--) {
      const idx = systemUnits.space.indexOf(costOrder[i])
      if (idx >= 0) {
        const removed = systemUnits.space.splice(idx, 1)[0]
        if (destroyerName) {
          this.factionAbilities.onUnitDestroyed(systemId, removed, destroyerName, null)
        }
        remaining--
      }
    }
  }

  /**
 * Assign space cannon defense hits to ground forces in space (pre-commit).
 */
  Twilight.prototype._assignGroundForcesInSpaceHits = function(systemId, ownerName, hits, destroyerName) {
    const systemUnits = this.state.units[systemId]
    if (!systemUnits || hits <= 0) {
      return
    }

    let remaining = hits

    // Remove ground forces from space
    for (let i = systemUnits.space.length - 1; i >= 0 && remaining > 0; i--) {
      const unit = systemUnits.space[i]
      if (unit.owner === ownerName) {
        const def = res.getUnit(unit.type)
        if (def?.category === 'ground') {
          const removed = systemUnits.space.splice(i, 1)[0]
          if (destroyerName) {
            this.factionAbilities.onUnitDestroyed(systemId, removed, destroyerName, null)
          }
          remaining--
        }
      }
    }
  }


  // Prompt the player to distribute ground forces across planets.
  // Only presents a choice when 2+ enemy planets exist; otherwise auto-commits.
  Twilight.prototype._distributeGroundForces = function(systemId, player, availablePlanets, enemyPlanets) {
    const systemUnits = this.state.units[systemId]

    const groundForces = systemUnits.space
      .filter(u => u.owner === player.name && res.getUnit(u.type)?.category === 'ground')
    if (groundForces.length === 0) {
      return
    }

    // Single enemy planet (or fewer): auto-commit all to the enemy planet
    if (enemyPlanets.length <= 1) {
      const targetPlanet = enemyPlanets[0] || availablePlanets[0]
      this._moveGroundForcesToPlanet(systemId, targetPlanet, player.name)
      return
    }

    // Multiple enemy planets: player chooses distribution across all available planets
    const selection = this.actions.choose(player, ['Done'], {
      title: 'Commit Ground Forces',
      allowsAction: 'commit-ground-forces',
      planets: availablePlanets,
    })

    if (selection.action === 'commit-ground-forces' && selection.assignments) {
      for (const [planetId, unitCounts] of Object.entries(selection.assignments)) {
        if (!availablePlanets.includes(planetId)) {
          continue
        }
        for (const [unitType, count] of Object.entries(unitCounts)) {
          this._moveGroundForcesToPlanet(systemId, planetId, player.name, unitType, count)
        }
      }
    }
  }

  // Place ground forces on friendly/empty planets (non-invasion).
  // If multiple landable planets, lets the player choose distribution.
  Twilight.prototype._placeGroundForces = function(systemId, player, tile, systemPlanets) {
    const planets = systemPlanets || (tile ? tile.planets : [])
    const systemUnits = this.state.units[systemId]

    const groundForces = systemUnits.space
      .filter(u => u.owner === player.name && res.getUnit(u.type)?.category === 'ground')
    if (groundForces.length === 0) {
      return
    }

    // Filter to non-DMZ planets the player can land on (friendly or uncontrolled)
    const landablePlanets = planets.filter(pId => {
      if (this._isDemilitarizedZone?.(pId)) {
        return false
      }
      const controller = this.state.planets[pId]?.controller
      return !controller || controller === player.name
    })

    if (landablePlanets.length === 0) {
      return
    }

    if (landablePlanets.length === 1) {
      this._autoPlaceGroundForces(systemId, player.name, tile, landablePlanets)
      return
    }

    // Multiple planets: player chooses distribution
    const selection = this.actions.choose(player, ['Done'], {
      title: 'Commit Ground Forces',
      allowsAction: 'commit-ground-forces',
      planets: landablePlanets,
    })

    if (selection.action === 'commit-ground-forces' && selection.assignments) {
      for (const [planetId, unitCounts] of Object.entries(selection.assignments)) {
        if (!landablePlanets.includes(planetId)) {
          continue
        }
        for (const [unitType, count] of Object.entries(unitCounts)) {
          this._moveGroundForcesToPlanet(systemId, planetId, player.name, unitType, count)
        }
      }

      // Take control of newly occupied uncontrolled planets
      for (const planetId of landablePlanets) {
        const hasForces = (systemUnits.planets[planetId] || []).some(
          u => u.owner === player.name && res.getUnit(u.type)?.category === 'ground'
        )
        if (hasForces && !this.state.planets[planetId]?.controller) {
          this.state.planets[planetId] = this.state.planets[planetId] || {}
          this.state.planets[planetId].controller = player.name
          this.state.planets[planetId].exhausted = true
          this._explorePlanet(planetId, player.name)

          if (planetId === 'mecatol-rex' && !this.state.custodiansRemoved) {
            const cost = this.factionAbilities.getCustodiansCost(player)
            if (cost > 0 && player.getTotalInfluence() < cost) {
            // Cannot afford custodians — skip
            }
            else {
              if (cost > 0) {
                this._payInfluence(player, cost)
              }
              this.state.custodiansRemoved = true
              player.addVictoryPoints(1)
              this.log.add({
                template: '{player} removes the Custodians Token and gains 1 VP!',
                args: { player: player.name },
              })
            }
          }

          this.factionAbilities.onPlanetGained(player.name, planetId, systemId, {})
        }
      }
    }
    else {
      // Player chose Done / skipped — auto-place on first planet
      this._autoPlaceGroundForces(systemId, player.name, tile, landablePlanets)
    }
  }

  // Move a specific number of ground forces of a given type from space to a planet.
  // If unitType/count not specified, moves all ground forces.
  Twilight.prototype._moveGroundForcesToPlanet = function(systemId, planetId, ownerName, unitType, count) {
    const systemUnits = this.state.units[systemId]
    if (!systemUnits.planets[planetId]) {
      systemUnits.planets[planetId] = []
    }

    let moved = 0
    for (let i = systemUnits.space.length - 1; i >= 0; i--) {
      const unit = systemUnits.space[i]
      if (unit.owner !== ownerName) {
        continue
      }
      const unitDef = res.getUnit(unit.type)
      if (unitDef?.category !== 'ground') {
        continue
      }
      if (unitType && unit.type !== unitType) {
        continue
      }
      systemUnits.planets[planetId].push(systemUnits.space.splice(i, 1)[0])
      moved++
      if (count !== undefined && moved >= count) {
        break
      }
    }
  }

  Twilight.prototype._groundCombat = function(systemId, planetId, attackerName) {
    const systemUnits = this.state.units[systemId]
    const planetUnits = systemUnits.planets[planetId]
    if (!planetUnits) {
      return
    }

    const defenderName = this.state.planets[planetId]?.controller
    if (!defenderName) {
      return
    }

    const attackerForces = planetUnits.filter(u => u.owner === attackerName)
    const defenderForces = planetUnits.filter(u => u.owner === defenderName)

    if (attackerForces.length === 0 || defenderForces.length === 0) {
      return
    }

    this.log.add({
      template: 'Ground combat on {planet}',
      args: { planet: planetId },
      event: 'combat',
    })
    if (!this.state._combatLog) {
      this.state._combatLog = []
    }
    this.state._combatLog.push({
      type: 'ground-combat-start',
      systemId,
      planetId,
      attacker: attackerName,
      defender: defenderName,
    })
    this.state.currentCombat = { systemId, planetId, type: 'ground', step: 'combat-round' }

    // Pre-combat faction abilities (e.g., Yin Indoctrination)
    this.factionAbilities.onGroundCombatStart(systemId, planetId, attackerName, defenderName)

    // Magen Defense Grid: if planet has defender's structures, produce 1 auto-hit on attacker
    const defenderPlayer = this.players.byName(defenderName)
    if (defenderPlayer && defenderPlayer.hasTechnology('magen-defense-grid')) {
      const defStructures = planetUnits.filter(u => {
        if (u.owner !== defenderName) {
          return false
        }
        const uDef = res.getUnit(u.type)
        return uDef?.category === 'structure'
      })
      if (defStructures.length > 0) {
        this.log.add({
          template: 'Magen Defense Grid: 1 automatic hit on attacker',
          args: {},
        })
        this._assignGroundHits(systemId, planetId, attackerName, 1, defenderName)
      }
    }

    let round = 0
    const MAX_ROUNDS = 20
    while (round < MAX_ROUNDS) {
      round++
      this.state.currentCombat.round = round

      const attackers = planetUnits.filter(u => u.owner === attackerName)
      const defenders = planetUnits.filter(u => u.owner === defenderName)

      if (attackers.length === 0 || defenders.length === 0) {
        break
      }

      // Start-of-round faction abilities (e.g., Sol agent Evelyn Delouis bonus die)
      this.factionAbilities.onGroundCombatRoundStart(systemId, planetId, attackerName, defenderName)

      this.state._combatOpponent = { [attackerName]: defenderName, [defenderName]: attackerName }
      const groundContext = { combatType: 'ground', systemId, planetId }
      const attackerRoll = this._rollCombatDice(attackers, groundContext)
      const defenderRoll = this._rollCombatDice(defenders, groundContext)
      delete this.state._combatOpponent

      // Clean up temporary bonusDice from round-start hooks
      for (const u of [...attackers, ...defenders]) {
        delete u.bonusDice
      }

      // Crown of Thalnos: reroll missed dice (+1), destroy units that still miss
      let attackerHits = attackerRoll.hits + this._offerCrownOfThalnos(attackerName, attackerRoll, groundContext)
      let defenderHits = defenderRoll.hits + this._offerCrownOfThalnos(defenderName, defenderRoll, groundContext)

      // X-89 Bacterial Weapon ΩΩ: double ground combat hits
      const attackerPlayer = this.players.byName(attackerName)
      if (attackerPlayer?.hasTechnology('x89-bacterial-weapon')) {
        attackerHits *= 2
      }
      if (defenderPlayer?.hasTechnology('x89-bacterial-weapon')) {
        defenderHits *= 2
      }

      this.state._combatLog.push({
        type: 'combat-round',
        combatType: 'ground',
        systemId,
        planetId,
        round,
        sides: {
          attacker: { name: attackerName, rolls: _mapRolls(attackerRoll), totalHits: attackerHits },
          defender: { name: defenderName, rolls: _mapRolls(defenderRoll), totalHits: defenderHits },
        },
      })

      this._assignGroundHits(systemId, planetId, defenderName, attackerHits, attackerName)
      this._assignGroundHits(systemId, planetId, attackerName, defenderHits, defenderName)

      // End-of-round faction abilities (e.g., L1Z1X Harrow, Sardakk Valkyrie Particle Weave)
      this.factionAbilities.onGroundCombatRoundEnd(systemId, planetId, attackerName, defenderName, { attackerHits, defenderHits })
    }

    // Determine ground combat winner/loser
    const aForcesAfter = planetUnits.filter(u => u.owner === attackerName)
    const dForcesAfter = planetUnits.filter(u => u.owner === defenderName)
    const groundWinner = (aForcesAfter.length > 0 && dForcesAfter.length === 0) ? attackerName
      : (dForcesAfter.length > 0 && aForcesAfter.length === 0) ? defenderName
        : null

    this.state._combatLog.push({
      type: 'combat-end',
      combatType: 'ground',
      systemId,
      planetId,
      winner: groundWinner,
      loser: groundWinner ? (groundWinner === attackerName ? defenderName : attackerName) : null,
    })

    if (groundWinner) {
      const loser = groundWinner === attackerName ? defenderName : attackerName
      this.factionAbilities.afterCombatResolved(systemId, groundWinner, loser, 'ground')
      this._detectCombatSecrets(systemId, groundWinner, loser, 'ground')

      // Dacxive Animators: winner places 1 infantry on the planet
      const winnerPlayer = this.players.byName(groundWinner)
      if (winnerPlayer && winnerPlayer.hasTechnology('dacxive-animators')) {
        this._addUnit(systemId, planetId, 'infantry', groundWinner)
        this.log.add({
          template: 'Dacxive Animators: {player} places 1 infantry on {planet}',
          args: { player: groundWinner, planet: planetId },
        })
      }
    }

    delete this.state.currentCombat
  }

  Twilight.prototype._assignGroundHits = function(systemId, planetId, ownerName, hits, destroyerName, hitSource) {
    if (hits <= 0) {
      return
    }

    // Allow faction abilities to cancel hits (e.g., Titans agent Tellurian)
    const effectiveHits = this.factionAbilities.onHitsProduced(ownerName, systemId, hits, hitSource || 'ground')
    if (effectiveHits <= 0) {
      return
    }
    hits = effectiveHits

    const planetUnits = this.state.units[systemId].planets[planetId]
    if (!planetUnits) {
      return
    }

    let remainingHits = hits
    const justSustainedIds = new Set()
    const assignments = []

    // Non-Euclidean Shielding: each sustain cancels 2 hits instead of 1
    const groundOwner = this.players.byName(ownerName)
    const groundHitsPerSustain = groundOwner
      ? this.factionAbilities.getSustainDamageHitsCancel(groundOwner)
      : 1

    // Check if opponent mech blocks sustain damage on this planet (Mentak Moll Terminus)
    const sustainBlocked = this.factionAbilities.isGroundSustainBlocked(ownerName, systemId, planetId)

    // First, sustain damage on undamaged units (mechs)
    let sustainableUnits = planetUnits
      .filter(u => u.owner === ownerName && !u.damaged)
      .filter(u => {
        const def = this._getUnitStats(u.owner, u.type)
        return def && def.abilities.includes('sustain-damage')
      })
      .sort((a, b) => {
        const defA = this._getUnitStats(a.owner, a.type)
        const defB = this._getUnitStats(b.owner, b.type)
        return (defB?.cost || 0) - (defA?.cost || 0)
      })

    // Bombardment/space cannon immunity: filter out immune mechs (Xxcha Indomitus)
    if (hitSource === 'bombardment') {
      sustainableUnits = sustainableUnits.filter(u => {
        if (u.type !== 'mech') {
          return true
        }
        return !this.factionAbilities.isMechImmuneToAbilityHits(u.owner)
      })
    }

    // Moll Terminus: opponent mech blocks sustain damage
    if (sustainBlocked) {
      sustainableUnits = []
    }

    for (const unit of sustainableUnits) {
      if (remainingHits <= 0) {
        break
      }
      unit.damaged = true
      justSustainedIds.add(unit.id)
      assignments.push({ owner: ownerName, unitType: unit.type, unitId: unit.id, result: 'sustained' })
      remainingHits = Math.max(0, remainingHits - groundHitsPerSustain)
    }

    // Faction hook: after units sustain damage (e.g., Letnev commander, Sardakk Valkyrie Exoskeleton)
    if (justSustainedIds.size > 0) {
      this.factionAbilities.onUnitsSustainedDamage(ownerName, systemId, justSustainedIds.size, planetId, justSustainedIds)
    }

    // Then destroy cheapest units first
    while (remainingHits > 0) {
      let units = planetUnits.filter(u => u.owner === ownerName)
      // Bombardment immunity: skip immune mechs from destruction (Xxcha Indomitus)
      if (hitSource === 'bombardment') {
        units = units.filter(u => {
          if (u.type !== 'mech') {
            return true
          }
          return !this.factionAbilities.isMechImmuneToAbilityHits(u.owner)
        })
      }
      if (units.length === 0) {
        break
      }

      units.sort((a, b) => {
        const defA = this._getUnitStats(a.owner, a.type)
        const defB = this._getUnitStats(b.owner, b.type)
        return (defA?.cost || 0) - (defB?.cost || 0)
      })

      const target = units[0]
      const idx = planetUnits.findIndex(u => u.id === target.id)
      if (idx !== -1) {
        const removed = planetUnits.splice(idx, 1)[0]
        assignments.push({ owner: ownerName, unitType: removed.type, unitId: removed.id, result: 'destroyed' })
        if (destroyerName) {
          this.factionAbilities.onUnitDestroyed(systemId, removed, destroyerName, planetId)
        }
      }
      remainingHits--
    }

    // Duranium Armor: repair 1 damaged unit that did NOT sustain this round
    if (groundOwner && groundOwner.hasTechnology('duranium-armor')) {
      const repairCandidate = planetUnits.find(
        u => u.owner === ownerName && u.damaged && !justSustainedIds.has(u.id)
      )
      if (repairCandidate) {
        repairCandidate.damaged = false
      }
    }

    if (assignments.length > 0) {
      this.state._combatLog.push({
        type: 'hits-assigned',
        combatType: hitSource || 'ground',
        systemId,
        planetId,
        assignments,
      })
    }
  }

  Twilight.prototype._establishControl = function(systemId, planetId, attackerName, preInvasionStructures) {
    const planetUnits = this.state.units[systemId].planets[planetId] || []
    const defenderName = this.state.planets[planetId]?.controller

    const attackerForces = planetUnits.filter(u => u.owner === attackerName)
    const defenderForces = defenderName
      ? planetUnits.filter(u => u.owner === defenderName)
      : []

    if (attackerForces.length > 0 && defenderForces.length === 0) {
    // Remove any remaining defender structures
      if (defenderName) {
        const structuresToRemove = planetUnits.filter(u => {
          if (u.owner !== defenderName) {
            return false
          }
          const def = res.getUnit(u.type)
          return def?.category === 'structure'
        })
        for (const structure of structuresToRemove) {
          const idx = planetUnits.findIndex(u => u.id === structure.id)
          if (idx !== -1) {
            planetUnits.splice(idx, 1)
          }
        }
      }

      // Use pre-invasion structure counts (captured before combat destroyed them)
      const structureCounts = preInvasionStructures || {}

      const previousController = this.state.planets[planetId].controller
      this.state.planets[planetId].controller = attackerName
      this.state.planets[planetId].exhausted = true  // newly gained planets are exhausted

      // Rule 100: Activate Wormhole Nexus when Mallice is controlled
      if (planetId === 'mallice' && !this.state.wormholeNexusActive) {
        this.state.wormholeNexusActive = true
        this.log.add({
          template: 'Wormhole Nexus activated — alpha, beta, and gamma wormholes now active',
          args: {},
        })
      }

      // become-a-martyr: defender lost a planet in their home system
      if (previousController) {
        const previousPlayer = this.players.byName(previousController)
        if (previousPlayer) {
          const factions = require('../res/factions/index.js')
          const f = factions.getFaction(previousPlayer.factionId)
          if (f && f.homeSystem === systemId) {
            this._recordSecretTrigger(previousController, 'become-a-martyr')
          }
        }
      }

      // Faction abilities on planet lost (e.g., Winnu Reclaimer DEPLOY)
      if (previousController) {
        this.factionAbilities.onPlanetLost(previousController, planetId, systemId, attackerName)
      }

      this.log.add({
        template: '{player} takes control of {planet}',
        args: { player: attackerName, planet: planetId },
      })

      // Explore planet if it wasn't controlled by another player
      if (!previousController) {
        this._explorePlanet(planetId, attackerName)
      }

      // Check for Mecatol Rex custodians
      if (planetId === 'mecatol-rex' && !this.state.custodiansRemoved) {
        const player = this.players.byName(attackerName)
        const cost = this.factionAbilities.getCustodiansCost(player)
        if (cost > 0 && player.getTotalInfluence() < cost) {
        // Cannot afford custodians — skip
        }
        else {
          if (cost > 0) {
            this._payInfluence(player, cost)
          }
          this.state.custodiansRemoved = true
          player.addVictoryPoints(1)

          this.log.add({
            template: '{player} removes the Custodians Token and gains 1 VP!',
            args: { player: attackerName },
          })
        }
      }

      // Faction abilities on planet gained (Saar scavenge, L1Z1X assimilate, Winnu reclamation)
      this.factionAbilities.onPlanetGained(attackerName, planetId, systemId, structureCounts, previousController)

      // Integrated Economy: free production up to planet's resource value
      const iePlayer = this.players.byName(attackerName)
      if (iePlayer && iePlayer.hasTechnology('integrated-economy')) {
        const planet = res.getPlanet(planetId)
        if (planet && planet.resources > 0) {
          const prodSel = this.actions.choose(iePlayer, ['Done'], {
            title: `Integrated Economy: Free production (up to ${planet.resources} cost)`,
            allowsAction: 'produce-units',
          })

          if (prodSel.action === 'produce-units') {
            const reqUnits = prodSel.units || []
            let ieCost = 0
            let ieCount = 0
            for (const req of reqUnits) {
              const unitDef = this._getUnitStats(attackerName, req.type)
              if (!unitDef) {
                continue
              }
              for (let ii = 0; ii < req.count; ii++) {
                let unitCost = unitDef.cost
                if (unitDef.costFor > 1 && ii % unitDef.costFor !== 0) {
                  unitCost = 0
                }
                if (ieCost + unitCost > planet.resources) {
                  break
                }
                ieCost += unitCost
                ieCount++
                if (unitDef.category === 'ship') {
                  this._addUnit(systemId, 'space', unitDef.type, attackerName)
                }
                else {
                  this._addUnit(systemId, planetId, unitDef.type, attackerName)
                }
              }
            }
            if (ieCount > 0) {
              this.log.add({
                template: 'Integrated Economy: {player} produces {count} free units on {planet}',
                args: { player: attackerName, count: ieCount, planet: planetId },
              })
            }
          }
        }
      }
    }
  }

  Twilight.prototype._autoPlaceGroundForces = function(systemId, ownerName, tile, systemPlanets) {
    const planets = systemPlanets || (tile ? tile.planets : [])
    const systemUnits = this.state.units[systemId]

    // Find ground forces in space
    const groundForces = []
    for (let i = systemUnits.space.length - 1; i >= 0; i--) {
      const unit = systemUnits.space[i]
      if (unit.owner === ownerName) {
        const unitDef = res.getUnit(unit.type)
        if (unitDef?.category === 'ground') {
          groundForces.push(systemUnits.space.splice(i, 1)[0])
        }
      }
    }

    if (groundForces.length === 0) {
      return
    }

    // Place on first non-DMZ planet
    const targetPlanet = planets.find(pId => !this._isDemilitarizedZone?.(pId)) || planets[0]
    if (!systemUnits.planets[targetPlanet]) {
      systemUnits.planets[targetPlanet] = []
    }

    for (const unit of groundForces) {
      systemUnits.planets[targetPlanet].push(unit)
    }

    // Take control if uncontrolled
    if (!this.state.planets[targetPlanet]?.controller) {
      this.state.planets[targetPlanet].controller = ownerName
      this.state.planets[targetPlanet].exhausted = true

      // Explore newly controlled planet
      this._explorePlanet(targetPlanet, ownerName)

      // Check for Mecatol Rex custodians
      if (targetPlanet === 'mecatol-rex' && !this.state.custodiansRemoved) {
        const player = this.players.byName(ownerName)
        const cost = this.factionAbilities.getCustodiansCost(player)
        if (cost > 0 && player.getTotalInfluence() < cost) {
        // Cannot afford custodians — skip
        }
        else {
          if (cost > 0) {
            this._payInfluence(player, cost)
          }
          this.state.custodiansRemoved = true
          player.addVictoryPoints(1)

          this.log.add({
            template: '{player} removes the Custodians Token and gains 1 VP!',
            args: { player: ownerName },
          })
        }
      }

      // Faction abilities on planet gained
      this.factionAbilities.onPlanetGained(ownerName, targetPlanet, systemId, {})
    }
  }

  Twilight.prototype._discardGroundForcesInSpace = function(systemId, ownerName) {
    const systemUnits = this.state.units[systemId]
    for (let i = systemUnits.space.length - 1; i >= 0; i--) {
      const unit = systemUnits.space[i]
      if (unit.owner === ownerName) {
        const unitDef = res.getUnit(unit.type)
        if (unitDef?.category === 'ground') {
          systemUnits.space.splice(i, 1)
        }
      }
    }
  }

} // module.exports
