const res = require('../../res/index.js')

module.exports = {
  // Commander — Dirzuga Rophal: After you produce units, place 1 infantry
  // from your reinforcements on a planet that contains your space dock in that system.
  afterProduction(player, ctx, { systemId, unitCount }) {
    if (!player.isCommanderUnlocked()) {
      return
    }

    if (unitCount <= 0) {
      return
    }

    const tile = ctx.game.res.getSystemTile(systemId) || ctx.game.res.getSystemTile(Number(systemId))
    if (!tile) {
      return
    }

    const systemUnits = ctx.state.units[systemId]
    if (!systemUnits) {
      return
    }

    // Find planets with player's space dock in this system
    const dockPlanets = []
    for (const planetId of tile.planets) {
      const planetUnits = systemUnits.planets[planetId] || []
      if (planetUnits.some(u => u.owner === player.name && u.type === 'space-dock')) {
        dockPlanets.push(planetId)
      }
    }

    if (dockPlanets.length === 0) {
      return
    }

    let targetPlanet
    if (dockPlanets.length === 1) {
      targetPlanet = dockPlanets[0]
    }
    else {
      const selection = ctx.actions.choose(player, dockPlanets, {
        title: 'Dirzuga Rophal: Place 1 infantry on which planet?',
      })
      targetPlanet = selection[0]
    }

    ctx.game._addUnitToPlanet(systemId, targetPlanet, 'infantry', player.name)
    ctx.log.add({
      template: 'Dirzuga Rophal: {player} places 1 infantry on {planet}',
      args: { player, planet: targetPlanet },
    })
  },

  // Mitosis: At the start of the status phase, place 1 infantry from your
  // reinforcements on any planet you control.
  // Mech DEPLOY: may replace 1 infantry with 1 mech instead.
  onStatusPhaseStart(player, ctx) {
    const controlledPlanets = player.getControlledPlanets()
    if (controlledPlanets.length === 0) {
      return
    }

    const choices = ['Pass', ...controlledPlanets]
    const selection = ctx.actions.choose(player, choices, {
      title: 'Mitosis: Place 1 infantry on a planet you control?',
    })

    if (selection[0] === 'Pass') {
      return
    }

    const targetPlanet = selection[0]
    const systemId = ctx.game._findSystemForPlanet(targetPlanet)
    if (systemId) {
      ctx.game._addUnitToPlanet(systemId, targetPlanet, 'infantry', player.name)
      ctx.log.add({
        template: '{player} uses Mitosis: 1 infantry on {planet}',
        args: { player, planet: targetPlanet },
      })
    }
  },

  // ---------------------------------------------------------------------------
  // Bioplasmosis — faction tech (green)
  // At end of status phase, you may remove any number of infantry from planets
  // you control and place them on 1 or more planets you control in the same or
  // adjacent systems.
  // ---------------------------------------------------------------------------
  onStatusPhaseEnd(player, ctx) {
    if (!player.hasTechnology('bioplasmosis')) {
      return
    }

    const controlledPlanets = player.getControlledPlanets()
    if (controlledPlanets.length < 2) {
      return
    }

    // Find all infantry on controlled planets
    const infantryByPlanet = {}
    for (const planetId of controlledPlanets) {
      const systemId = ctx.game._findSystemForPlanet(planetId)
      if (!systemId) {
        continue
      }
      const planetUnits = ctx.state.units[systemId]?.planets[planetId] || []
      const infantry = planetUnits.filter(u => u.owner === player.name && u.type === 'infantry')
      if (infantry.length > 0) {
        infantryByPlanet[planetId] = { count: infantry.length, systemId }
      }
    }

    if (Object.keys(infantryByPlanet).length === 0) {
      return
    }

    // Allow the player to move infantry one at a time
    let moved = 0
    for (let i = 0; i < 20; i++) { // Safety limit — max 20 moves
      // Rebuild available sources
      const sources = []
      for (const planetId of controlledPlanets) {
        const systemId = ctx.game._findSystemForPlanet(planetId)
        if (!systemId) {
          continue
        }
        const planetUnits = ctx.state.units[systemId]?.planets[planetId] || []
        const infantry = planetUnits.filter(u => u.owner === player.name && u.type === 'infantry')
        if (infantry.length > 0) {
          sources.push(planetId)
        }
      }

      if (sources.length === 0) {
        break
      }

      const fromChoices = ['Done', ...sources.map(p => `from:${p}`)]
      const fromSel = ctx.actions.choose(player, fromChoices, {
        title: `Bioplasmosis: Move infantry (${moved} moved so far)`,
      })

      if (fromSel[0] === 'Done') {
        break
      }

      const fromPlanet = fromSel[0].replace('from:', '')
      const fromSystem = ctx.game._findSystemForPlanet(fromPlanet)
      if (!fromSystem) {
        continue
      }

      // Find valid destinations: controlled planets in the same or adjacent systems
      const adjacentSystems = ctx.game._getAdjacentSystems(fromSystem)
      const validDestinations = controlledPlanets.filter(pId => {
        if (pId === fromPlanet) {
          return false
        }
        const pSystem = ctx.game._findSystemForPlanet(pId)
        return pSystem === fromSystem || adjacentSystems.includes(pSystem)
      })

      if (validDestinations.length === 0) {
        continue
      }

      const toSel = ctx.actions.choose(player, validDestinations, {
        title: 'Bioplasmosis: Choose destination planet',
      })
      const toPlanet = toSel[0]
      const toSystem = ctx.game._findSystemForPlanet(toPlanet)
      if (!toSystem) {
        continue
      }

      // Move the infantry
      const fromUnits = ctx.state.units[fromSystem].planets[fromPlanet]
      const infIdx = fromUnits.findIndex(u => u.owner === player.name && u.type === 'infantry')
      if (infIdx !== -1) {
        const unit = fromUnits.splice(infIdx, 1)[0]
        if (!ctx.state.units[toSystem].planets[toPlanet]) {
          ctx.state.units[toSystem].planets[toPlanet] = []
        }
        ctx.state.units[toSystem].planets[toPlanet].push(unit)
        moved++
      }
    }

    if (moved > 0) {
      ctx.log.add({
        template: 'Bioplasmosis: {player} moves {count} infantry',
        args: { player: player.name, count: moved },
      })
    }
  },

  // ---------------------------------------------------------------------------
  // Psychospore — faction tech (component action)
  // ACTION: Exhaust this card to remove a command token from a system that
  // contains 1 or more of your infantry and return it to your reinforcements.
  // Then, place 1 infantry in that system.
  // ---------------------------------------------------------------------------
  // Registered as a tech component action in the engine.

  // ---------------------------------------------------------------------------
  // Hero — Letani Miasmiala: ULTRASONIC EMITTER
  // ACTION: Produce any number of units in any number of systems that contain
  // 1 or more of your ground forces (no space dock needed). Then, purge.
  // ---------------------------------------------------------------------------
  componentActions: [
    {
      id: 'letani-miasmiala-hero',
      name: 'Letani Miasmiala',
      abilityId: 'mitosis',
      isAvailable: function(player) {
        return player.isHeroUnlocked() && !player.isHeroPurged()
      },
    },
  ],

  letaniMiasmialaHero(ctx, player) {
    // Find all systems with player's ground forces
    const systemsWithGround = []
    for (const [systemId, systemUnits] of Object.entries(ctx.state.units)) {
      for (const [_planetId, planetUnits] of Object.entries(systemUnits.planets)) {
        const hasGround = planetUnits.some(
          u => u.owner === player.name && (u.type === 'infantry' || u.type === 'mech')
        )
        if (hasGround) {
          systemsWithGround.push(systemId)
          break
        }
      }
    }

    if (systemsWithGround.length === 0) {
      player.purgeHero()
      ctx.log.add({
        template: '{player} purges Letani Miasmiala (no systems with ground forces)',
        args: { player: player.name },
      })
      return
    }

    let totalProduced = 0

    // For each system with ground forces, allow production of up to 2 units
    for (const systemId of systemsWithGround) {
      const tile = res.getSystemTile(systemId) || res.getSystemTile(Number(systemId))
      if (!tile) {
        continue
      }

      const produceSelection = ctx.actions.choose(player, ['Done'], {
        title: `Ultrasonic Emitter: Produce in system ${systemId}`,
        allowsAction: 'produce-units',
      })

      if (produceSelection.action !== 'produce-units') {
        continue
      }

      const requestedUnits = produceSelection.units || []
      if (requestedUnits.length === 0) {
        continue
      }

      // Place up to 2 units in this system (hero limit)
      let systemProduced = 0
      for (const req of requestedUnits) {
        if (systemProduced >= 2) {
          break
        }
        const unitDef = ctx.game._getUnitStats(player.name, req.type)
        if (!unitDef) {
          continue
        }

        for (let i = 0; i < req.count && systemProduced < 2; i++) {
          if (unitDef.category === 'ship') {
            ctx.game._addUnit(systemId, 'space', unitDef.type, player.name)
          }
          else if (unitDef.category === 'ground') {
            // Place on the first controlled planet in the system
            const targetPlanet = tile.planets.find(
              pId => ctx.state.planets[pId]?.controller === player.name
            )
            if (targetPlanet) {
              ctx.game._addUnit(systemId, targetPlanet, unitDef.type, player.name)
            }
          }
          systemProduced++
          totalProduced++
        }
      }

      if (systemProduced > 0) {
        ctx.log.add({
          template: 'Ultrasonic Emitter: {player} produces {count} units in system {system}',
          args: { player: player.name, count: systemProduced, system: systemId },
        })
      }
    }

    player.purgeHero()
    ctx.log.add({
      template: '{player} purges Letani Miasmiala',
      args: { player: player.name },
    })
  },
}
