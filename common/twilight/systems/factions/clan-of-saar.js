module.exports = {
  // ---------------------------------------------------------------------------
  // Nomadic — Can score objectives without controlling home system planets
  // ---------------------------------------------------------------------------
  canBypassHomeSystemCheck() {
    return true
  },


  // ---------------------------------------------------------------------------
  // Scavenge — After gaining control of a planet, gain 1 trade good
  // Mech DEPLOY — After gaining control of a planet, may spend 1 TG to place 1 mech
  // ---------------------------------------------------------------------------
  onPlanetGained(player, ctx, { planetId, systemId }) {
    // Scavenge
    player.addTradeGoods(1)
    ctx.log.add({
      template: '{player} gains 1 trade good (Scavenge)',
      args: { player },
    })

    // Mech DEPLOY: Scavenger Zeta — after gaining control of a planet,
    // may spend 1 trade good to place 1 mech on that planet
    if (player.tradeGoods >= 1) {
      const mechChoice = ctx.actions.choose(player, ['Deploy Scavenger Zeta', 'Pass'], {
        title: 'Scavenger Zeta DEPLOY: Spend 1 trade good to place 1 mech?',
      })

      if (mechChoice[0] === 'Deploy Scavenger Zeta') {
        player.addTradeGoods(-1)
        ctx.game._addUnit(systemId, planetId, 'mech', player.name)
        ctx.log.add({
          template: '{player} spends 1 TG to deploy Scavenger Zeta on {planet}',
          args: { player, planet: planetId },
        })
      }
    }
  },


  // ---------------------------------------------------------------------------
  // Hero — Gurno Aggero (ARMAGEDDON RELAY)
  // ---------------------------------------------------------------------------
  // ACTION: Choose 1 system that is adjacent to 1 of your space docks.
  // Destroy all other players' infantry and fighters in that system.
  // Then, purge this card.

  componentActions: [
    {
      id: 'armageddon-relay',
      name: 'Armageddon Relay',
      abilityId: 'nomadic',  // Any ability works — real check is hero status
      isAvailable: (player) => player.isHeroUnlocked() && !player.isHeroPurged(),
    },
  ],

  armageddonRelay(ctx, player) {
    // Find all systems adjacent to a Saar space dock (floating factories in space)
    const dockSystems = []
    for (const [sysId, systemUnits] of Object.entries(ctx.state.units)) {
      const hasDock = systemUnits.space.some(
        u => u.owner === player.name && u.type === 'space-dock'
      )
      if (hasDock) {
        dockSystems.push(sysId)
      }
    }

    if (dockSystems.length === 0) {
      return
    }

    // Collect all unique adjacent systems
    const adjacentSet = new Set()
    for (const dockSystem of dockSystems) {
      const adjacent = ctx.game._getAdjacentSystems(dockSystem)
      for (const adjId of adjacent) {
        adjacentSet.add(adjId)
      }
    }

    // Filter to systems that contain other players' infantry or fighters
    const targetSystems = [...adjacentSet].filter(sysId => {
      const systemUnits = ctx.state.units[sysId]
      if (!systemUnits) {
        return false
      }

      // Check space for fighters
      const enemyFighters = systemUnits.space.filter(
        u => u.owner !== player.name && u.type === 'fighter'
      )
      if (enemyFighters.length > 0) {
        return true
      }

      // Check planets for infantry
      for (const planetUnits of Object.values(systemUnits.planets)) {
        if (planetUnits.some(u => u.owner !== player.name && (u.type === 'infantry' || u.type === 'fighter'))) {
          return true
        }
      }
      return false
    })

    if (targetSystems.length === 0) {
      player.purgeHero()
      ctx.log.add({
        template: '{player} purges Gurno Aggero (no valid targets)',
        args: { player: player.name },
      })
      return
    }

    let targetSystem
    if (targetSystems.length === 1) {
      targetSystem = targetSystems[0]
    }
    else {
      const selection = ctx.actions.choose(player, targetSystems, {
        title: 'Armageddon Relay: Choose target system',
      })
      targetSystem = selection[0]
    }

    // Destroy all other players' infantry and fighters in that system
    const systemUnits = ctx.state.units[targetSystem]
    let destroyed = 0

    // Destroy fighters in space
    const fighters = systemUnits.space.filter(
      u => u.owner !== player.name && u.type === 'fighter'
    )
    for (const fighter of fighters) {
      const idx = systemUnits.space.indexOf(fighter)
      if (idx !== -1) {
        systemUnits.space.splice(idx, 1)
        destroyed++
      }
    }

    // Destroy infantry and fighters on planets
    for (const [_planetId, planetUnits] of Object.entries(systemUnits.planets)) {
      const toDestroy = planetUnits.filter(
        u => u.owner !== player.name && (u.type === 'infantry' || u.type === 'fighter')
      )
      for (const unit of toDestroy) {
        const idx = planetUnits.indexOf(unit)
        if (idx !== -1) {
          planetUnits.splice(idx, 1)
          destroyed++
        }
      }
    }

    ctx.log.add({
      template: 'Armageddon Relay: {player} destroys {count} infantry/fighters in system {system}',
      args: { player: player.name, count: destroyed, system: targetSystem },
    })

    player.purgeHero()
    ctx.log.add({
      template: '{player} purges Gurno Aggero',
      args: { player: player.name },
    })
  },

  // ---------------------------------------------------------------------------
  // Chaos Mapping — Activation Restriction
  // ---------------------------------------------------------------------------
  // Other players cannot activate asteroid fields that contain 1 or more of
  // your ships.

  isSystemActivationBlocked(saarPlayer, ctx, { systemId, activatingPlayerName }) {
    if (activatingPlayerName === saarPlayer.name) {
      return false
    }

    if (!saarPlayer.hasTechnology('chaos-mapping')) {
      return false
    }

    const tile = ctx.game.res.getSystemTile(systemId) || ctx.game.res.getSystemTile(Number(systemId))
    if (!tile || tile.anomaly !== 'asteroid-field') {
      return false
    }

    // Check if Saar has ships in this system
    const systemUnits = ctx.state.units[systemId]
    if (!systemUnits) {
      return false
    }

    const saarShips = systemUnits.space.filter(u => u.owner === saarPlayer.name)
    return saarShips.length > 0
  },


  // ---------------------------------------------------------------------------
  // Chaos Mapping — Turn Start Production
  // ---------------------------------------------------------------------------
  // At the start of your turn during the action phase, you may produce 1 unit
  // in a system that contains at least 1 of your units that has Production.

  onTurnStart(player, ctx) {
    if (!player.hasTechnology('chaos-mapping')) {
      return
    }

    // Find systems with player's Production units (space docks for Saar are in space)
    const productionSystems = []
    for (const [systemId, systemUnits] of Object.entries(ctx.state.units)) {
      // Check space area for Saar floating factories (space docks in space)
      const spaceDocks = systemUnits.space.filter(
        u => u.owner === player.name && u.type === 'space-dock'
      )
      if (spaceDocks.length > 0) {
        productionSystems.push(systemId)
        continue
      }

      // Also check planets for normal space docks (in case of edge cases)
      const tile = ctx.game.res.getSystemTile(systemId) || ctx.game.res.getSystemTile(Number(systemId))
      if (tile) {
        for (const planetId of tile.planets) {
          const planetUnits = systemUnits.planets[planetId] || []
          if (planetUnits.some(u => u.owner === player.name && u.type === 'space-dock')) {
            productionSystems.push(systemId)
            break
          }
        }
      }
    }

    if (productionSystems.length === 0) {
      return
    }

    const choice = ctx.actions.choose(player, ['Chaos Mapping: Produce 1 Unit', 'Pass'], {
      title: 'Chaos Mapping: Produce 1 unit in a system with a Production unit?',
    })

    if (choice[0] !== 'Chaos Mapping: Produce 1 Unit') {
      return
    }

    // Choose system
    let targetSystem
    if (productionSystems.length === 1) {
      targetSystem = productionSystems[0]
    }
    else {
      const systemChoice = ctx.actions.choose(player, productionSystems, {
        title: 'Chaos Mapping: Choose system to produce in',
      })
      targetSystem = systemChoice[0]
    }

    // Check for blockade (enemy ships in space)
    const targetUnits = ctx.state.units[targetSystem]
    const enemyShips = targetUnits.space.filter(
      u => u.owner !== player.name && (ctx.game.res.getUnit(u.type)?.category === 'ship')
    )
    const isBlockaded = enemyShips.length > 0

    // Choose unit type to produce
    const unitChoices = []
    if (!isBlockaded) {
      unitChoices.push('fighter', 'destroyer', 'cruiser', 'carrier', 'dreadnought')
    }
    // Ground forces can only go on a planet
    const tile = ctx.game.res.getSystemTile(targetSystem) || ctx.game.res.getSystemTile(Number(targetSystem))
    const controlledPlanets = tile ? tile.planets.filter(
      pId => ctx.state.planets[pId]?.controller === player.name
    ) : []
    if (controlledPlanets.length > 0) {
      unitChoices.push('infantry', 'mech')
    }

    if (unitChoices.length === 0) {
      return
    }

    const unitChoice = ctx.actions.choose(player, unitChoices, {
      title: 'Chaos Mapping: Choose unit type to produce',
    })
    const unitType = unitChoice[0]

    const unitDef = ctx.game.res.getUnit(unitType)
    if (!unitDef) {
      return
    }

    // Pay the cost
    const cost = unitDef.cost || 0
    if (cost > 0) {
      const availableResources = player.getTotalResources() + (player.tradeGoods || 0)
      if (availableResources < cost) {
        ctx.log.add({
          template: 'Chaos Mapping: {player} cannot afford {unitType} (cost {cost})',
          args: { player: player.name, unitType, cost },
        })
        return
      }

      // Spend resources: exhaust planets first, then trade goods
      let remaining = cost
      const controlled = player.getControlledPlanets()
      const readyPlanets = controlled.filter(pId => !ctx.state.planets[pId]?.exhausted)
      for (const pId of readyPlanets) {
        if (remaining <= 0) {
          break
        }
        const planet = ctx.game.res.getPlanet(pId)
        if (planet && planet.resources > 0) {
          ctx.state.planets[pId].exhausted = true
          remaining -= planet.resources
        }
      }
      if (remaining > 0) {
        const tgToSpend = Math.min(remaining, player.tradeGoods)
        player.tradeGoods -= tgToSpend
        remaining -= tgToSpend
      }
    }

    // Place the unit
    if (unitDef.category === 'ship') {
      ctx.game._addUnit(targetSystem, 'space', unitType, player.name)
    }
    else if (unitDef.category === 'ground') {
      const targetPlanet = controlledPlanets[0]
      if (targetPlanet) {
        ctx.game._addUnit(targetSystem, targetPlanet, unitType, player.name)
      }
    }

    ctx.log.add({
      template: 'Chaos Mapping: {player} produces 1 {unitType} in system {system}',
      args: { player: player.name, unitType, system: targetSystem },
    })
  },


  // ---------------------------------------------------------------------------
  // Commander — Rowl Sarrig
  // ---------------------------------------------------------------------------
  // When producing fighters or infantry, may place each at any of your
  // non-blockaded space docks.

  afterProduction(player, ctx, { systemId, producedUnits }) {
    if (!player.isCommanderUnlocked()) {
      return
    }

    if (!producedUnits || producedUnits.length === 0) {
      return
    }

    // Find produced fighters and infantry
    const redistributable = producedUnits.filter(
      u => u.type === 'fighter' || u.type === 'infantry'
    )

    if (redistributable.length === 0) {
      return
    }

    // Find all non-blockaded space docks belonging to the Saar player
    // Saar docks are in the space area (Floating Factory)
    const dockSystems = []
    for (const [sysId, systemUnits] of Object.entries(ctx.state.units)) {
      // Check space area for floating factories
      const hasDock = systemUnits.space.some(
        u => u.owner === player.name && u.type === 'space-dock'
      )
      if (!hasDock) {
        continue
      }

      // Check blockade
      const enemyShips = systemUnits.space.filter(
        u => u.owner !== player.name && (ctx.game.res.getUnit(u.type)?.category === 'ship')
      )
      if (enemyShips.length > 0) {
        continue
      }

      dockSystems.push(sysId)
    }

    // Need at least 2 dock locations to offer redistribution (the production system + others)
    if (dockSystems.length < 2) {
      return
    }

    // Offer to redistribute each fighter/infantry
    const choice = ctx.actions.choose(player, ['Redistribute Units', 'Pass'], {
      title: 'Rowl Sarrig: Redistribute produced fighters/infantry across space docks?',
    })

    if (choice[0] !== 'Redistribute Units') {
      return
    }

    for (const unitDef of redistributable) {
      // Find the unit that was just produced in the production system
      const sourceUnits = ctx.state.units[systemId]
      let unitToMove
      if (unitDef.type === 'fighter') {
        unitToMove = sourceUnits.space.find(
          u => u.owner === player.name && u.type === 'fighter'
        )
      }
      else if (unitDef.type === 'infantry') {
        // Infantry may be on a planet
        const tile = ctx.game.res.getSystemTile(systemId) || ctx.game.res.getSystemTile(Number(systemId))
        if (tile) {
          for (const planetId of tile.planets) {
            const pUnits = sourceUnits.planets[planetId] || []
            unitToMove = pUnits.find(u => u.owner === player.name && u.type === 'infantry')
            if (unitToMove) {
              break
            }
          }
        }
      }

      if (!unitToMove) {
        continue
      }

      // Choose destination dock
      const destChoice = ctx.actions.choose(player, dockSystems, {
        title: `Rowl Sarrig: Place ${unitDef.type} at which space dock?`,
      })
      const destSystem = destChoice[0]

      // Move unit if destination is different from source
      if (destSystem !== systemId) {
        // Remove from source
        if (unitDef.type === 'fighter') {
          const idx = sourceUnits.space.findIndex(u => u.id === unitToMove.id)
          if (idx !== -1) {
            sourceUnits.space.splice(idx, 1)
          }
        }
        else if (unitDef.type === 'infantry') {
          const tile = ctx.game.res.getSystemTile(systemId) || ctx.game.res.getSystemTile(Number(systemId))
          if (tile) {
            for (const planetId of tile.planets) {
              const pUnits = sourceUnits.planets[planetId] || []
              const idx = pUnits.findIndex(u => u.id === unitToMove.id)
              if (idx !== -1) {
                pUnits.splice(idx, 1)
                break
              }
            }
          }
        }

        // Add to destination
        if (unitDef.type === 'fighter') {
          ctx.state.units[destSystem].space.push(unitToMove)
        }
        else if (unitDef.type === 'infantry') {
          // Place infantry on a controlled planet in the destination system
          const destTile = ctx.game.res.getSystemTile(destSystem) || ctx.game.res.getSystemTile(Number(destSystem))
          if (destTile) {
            const destPlanet = destTile.planets.find(
              pId => ctx.state.planets[pId]?.controller === player.name
            )
            if (destPlanet) {
              if (!ctx.state.units[destSystem].planets[destPlanet]) {
                ctx.state.units[destSystem].planets[destPlanet] = []
              }
              ctx.state.units[destSystem].planets[destPlanet].push(unitToMove)
            }
            else {
              // No controlled planet — can't place infantry, put back
              if (unitDef.type === 'infantry') {
                const srcTile = ctx.game.res.getSystemTile(systemId) || ctx.game.res.getSystemTile(Number(systemId))
                if (srcTile && srcTile.planets.length > 0) {
                  const srcPlanet = srcTile.planets[0]
                  if (!sourceUnits.planets[srcPlanet]) {
                    sourceUnits.planets[srcPlanet] = []
                  }
                  sourceUnits.planets[srcPlanet].push(unitToMove)
                }
              }
            }
          }
        }

        ctx.log.add({
          template: 'Rowl Sarrig: {player} places {unitType} at space dock in system {system}',
          args: { player: player.name, unitType: unitDef.type, system: destSystem },
        })
      }
    }
  },


  // Agent — Captain Mendosa: After a player activates a system, exhaust to
  // increase the move value of 1 of that player's ships to match the highest
  // move value on the board.
  onAnySystemActivated(saarPlayer, ctx, { systemId: _systemId, activatingPlayer }) {
    if (!saarPlayer.isAgentReady()) {
      return
    }

    // Find the highest move value among all ships on the board
    let highestMove = 0
    for (const sysId of Object.keys(ctx.state.units)) {
      const systemUnits = ctx.state.units[sysId]
      for (const unit of systemUnits.space) {
        const unitDef = ctx.game._getUnitStats(unit.owner, unit.type)
        if (unitDef && unitDef.move > highestMove) {
          highestMove = unitDef.move
        }
      }
    }

    if (highestMove <= 0) {
      return
    }

    // Find which of the activating player's ship types would actually benefit
    const activatingShipTypes = new Set()
    for (const sysId of Object.keys(ctx.state.units)) {
      for (const unit of ctx.state.units[sysId].space) {
        if (unit.owner === activatingPlayer.name) {
          const unitDef = ctx.game._getUnitStats(unit.owner, unit.type)
          if (unitDef && unitDef.category === 'ship' && unitDef.move > 0 && unitDef.move < highestMove) {
            activatingShipTypes.add(unit.type)
          }
        }
      }
    }

    // No benefit if all ships already have the highest move value
    if (activatingShipTypes.size === 0) {
      return
    }

    const choice = ctx.actions.choose(saarPlayer, ['Exhaust Captain Mendosa', 'Pass'], {
      title: `Captain Mendosa: Exhaust to set 1 of ${activatingPlayer.name}'s ships to move ${highestMove}?`,
    })

    if (choice[0] !== 'Exhaust Captain Mendosa') {
      return
    }

    saarPlayer.exhaustAgent()

    // Choose which ship type gets the bonus
    const shipTypeArray = [...activatingShipTypes]
    let targetShipType
    if (shipTypeArray.length === 1) {
      targetShipType = shipTypeArray[0]
    }
    else {
      const typeChoice = ctx.actions.choose(saarPlayer, shipTypeArray, {
        title: `Captain Mendosa: Choose ship type to set to move ${highestMove}`,
      })
      targetShipType = typeChoice[0]
    }

    // Store the bonus on the current tactical action
    ctx.state.currentTacticalAction.mendosaBonus = {
      playerName: activatingPlayer.name,
      shipType: targetShipType,
      moveValue: highestMove,
    }

    ctx.log.add({
      template: 'Captain Mendosa: {player} sets {target}\'s {shipType} move value to {moveValue}',
      args: {
        player: saarPlayer.name,
        target: activatingPlayer.name,
        shipType: targetShipType,
        moveValue: highestMove,
      },
    })
  },
}
