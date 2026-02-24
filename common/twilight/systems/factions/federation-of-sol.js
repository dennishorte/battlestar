module.exports = {
  // Versatile: +1 command token during status phase
  getStatusPhaseTokenBonus() {
    return 1
  },

  componentActions: [
    {
      id: 'orbital-drop',
      name: 'Orbital Drop',
      abilityId: 'orbital-drop',
      isAvailable: (player) => player.commandTokens.strategy >= 1,
    },
    {
      id: 'helio-command-array',
      name: 'Helio Command Array',
      abilityId: 'helio-command-array',
      isAvailable: function(player) {
        return player.isHeroUnlocked() && !player.isHeroPurged()
      },
    },
  ],

  orbitalDrop(ctx, player) {
    player.commandTokens.strategy -= 1

    const controlledPlanets = player.getControlledPlanets()
    if (controlledPlanets.length === 0) {
      return
    }

    const selection = ctx.actions.choose(player, controlledPlanets, {
      title: 'Choose planet for Orbital Drop',
    })
    const targetPlanet = selection[0]
    const systemId = ctx.game._findSystemForPlanet(targetPlanet)

    if (systemId) {
      ctx.game._addUnitToPlanet(systemId, targetPlanet, 'infantry', player.name)
      ctx.game._addUnitToPlanet(systemId, targetPlanet, 'infantry', player.name)

      ctx.log.add({
        template: '{player} uses Orbital Drop: 2 infantry on {planet}',
        args: { player, planet: targetPlanet },
      })

      // Mech DEPLOY: after Orbital Drop, may spend 3 resources to place 1 mech
      const availableResources = player.getTotalResources() + (player.tradeGoods || 0)
      if (availableResources >= 3) {
        const mechChoice = ctx.actions.choose(player, ['Deploy Mech', 'Pass'], {
          title: 'ZS Thunderbolt M2 DEPLOY: Spend 3 resources to place 1 mech?',
        })
        if (mechChoice[0] === 'Deploy Mech') {
          // Pay 3 resources: exhaust planets first, then trade goods
          let remaining = 3
          const readyPlanets = player.getReadyPlanets()
            .map(pId => {
              const planet = ctx.game.res.getPlanet(pId)
              return { id: pId, resources: planet ? planet.resources : 0 }
            })
            .sort((a, b) => a.resources - b.resources)

          for (const planet of readyPlanets) {
            if (remaining <= 0) {
              break
            }
            ctx.state.planets[planet.id].exhausted = true
            remaining -= planet.resources
          }
          if (remaining > 0) {
            const tgToSpend = Math.min(remaining, player.tradeGoods)
            player.tradeGoods -= tgToSpend
          }

          ctx.game._addUnitToPlanet(systemId, targetPlanet, 'mech', player.name)
          ctx.log.add({
            template: '{player} deploys ZS Thunderbolt M2 on {planet}',
            args: { player, planet: targetPlanet },
          })
        }
      }
    }
  },

  // Hero: Helio Command Array — remove all command tokens from board, return to reinforcements
  helioCommandArray(ctx, player) {
    let recovered = 0
    for (const [_systemId, systemData] of Object.entries(ctx.state.systems)) {
      const idx = systemData.commandTokens.indexOf(player.name)
      if (idx !== -1) {
        systemData.commandTokens.splice(idx, 1)
        recovered++
      }
    }

    if (recovered > 0) {
      player.commandTokens.tactics += recovered
      ctx.log.add({
        template: 'Helio Command Array: {player} recovers {count} command tokens',
        args: { player: player.name, count: recovered },
      })
    }

    player.purgeHero()
    ctx.log.add({
      template: '{player} purges Jace X. 4th Air Legion',
      args: { player: player.name },
    })
  },

  // Commander: Claire Gibson — at start of ground combat you defend, place 1 infantry
  // Agent: Evelyn Delouis — offer to exhaust for +1 die to 1 ground force
  onGroundCombatStart(player, ctx, { systemId, planetId, opponentName: _opponentName }) {
    // Commander: Claire Gibson — place 1 infantry when defending
    if (player.isCommanderUnlocked()) {
      const planetUnits = ctx.state.units[systemId]?.planets[planetId] || []
      const hasGroundForces = planetUnits.some(u => u.owner === player.name)
      if (hasGroundForces) {
        ctx.game._addUnitToPlanet(systemId, planetId, 'infantry', player.name)
        ctx.log.add({
          template: 'Claire Gibson: {player} places 1 infantry on {planet}',
          args: { player: player.name, planet: planetId },
        })
      }
    }

    // Agent: Evelyn Delouis — offer to exhaust for +1 die this combat
    if (player.isAgentReady()) {
      const planetUnits = ctx.state.units[systemId]?.planets[planetId] || []
      const ownGroundForces = planetUnits.filter(u => u.owner === player.name)
      if (ownGroundForces.length > 0) {
        const choice = ctx.actions.choose(player, ['Exhaust Evelyn Delouis', 'Pass'], {
          title: 'Evelyn Delouis: Exhaust agent for +1 die to 1 ground force?',
        })
        if (choice[0] === 'Exhaust Evelyn Delouis') {
          if (!ctx.state._evelynDelouisActive) {
            ctx.state._evelynDelouisActive = {}
          }
          ctx.state._evelynDelouisActive[player.name] = true
        }
      }
    }
  },

  // Agent: Evelyn Delouis — at start of ground combat round, apply bonus die if activated
  onGroundCombatRoundStart(player, ctx, { systemId, planetId, opponentName: _opponentName }) {
    if (!player.isAgentReady()) {
      return
    }

    // Only apply if explicitly activated in onGroundCombatStart
    if (!ctx.state._evelynDelouisActive?.[player.name]) {
      return
    }

    const planetUnits = ctx.state.units[systemId]?.planets[planetId] || []
    const ownGroundForces = planetUnits.filter(u => u.owner === player.name)
    if (ownGroundForces.length === 0) {
      return
    }

    player.exhaustAgent()

    // Give bonus die to the strongest ground force (mech > infantry)
    const targetUnit = ownGroundForces.sort((a, b) => {
      const defA = ctx.game._getUnitStats(a.owner, a.type)
      const defB = ctx.game._getUnitStats(b.owner, b.type)
      return (defA?.combat || 10) - (defB?.combat || 10)
    })[0]

    if (targetUnit) {
      targetUnit.bonusDice = (targetUnit.bonusDice || 0) + 1
    }

    delete ctx.state._evelynDelouisActive[player.name]

    ctx.log.add({
      template: 'Evelyn Delouis: {player} gives 1 {unit} an extra combat die',
      args: { player: player.name, unit: targetUnit?.type || 'ground force' },
    })
  },

  // Spec Ops II: at start of turn, place revived infantry on a planet in home system
  onTurnStart(player, ctx) {
    const revivalCount = ctx.state.specOpsRevival?.[player.name] || 0
    if (revivalCount <= 0) {
      return
    }

    const homeSystemId = player.faction?.homeSystem
    if (!homeSystemId) {
      return
    }

    const tile = ctx.game.res.getSystemTile(homeSystemId)
    if (!tile || !tile.planets || tile.planets.length === 0) {
      return
    }

    // Find a planet in home system that player controls
    let targetPlanet
    if (tile.planets.length === 1) {
      targetPlanet = tile.planets[0]
    }
    else {
      const controlled = tile.planets.filter(
        pId => ctx.state.planets[pId]?.controller === player.name
      )
      if (controlled.length === 0) {
        // If no controlled planets, place on first planet
        targetPlanet = tile.planets[0]
      }
      else if (controlled.length === 1) {
        targetPlanet = controlled[0]
      }
      else {
        const sel = ctx.actions.choose(player, controlled, {
          title: `Spec Ops II: Place ${revivalCount} revived infantry on which planet?`,
        })
        targetPlanet = sel[0]
      }
    }

    for (let i = 0; i < revivalCount; i++) {
      ctx.game._addUnitToPlanet(homeSystemId, targetPlanet, 'infantry', player.name)
    }

    ctx.log.add({
      template: 'Spec Ops II: {player} places {count} revived infantry on {planet}',
      args: { player: player.name, count: revivalCount, planet: targetPlanet },
    })

    ctx.state.specOpsRevival[player.name] = 0
  },

  // Bellum Gloriosum: when producing capacity-bearing ships, place free ground forces/fighters
  afterProduction(player, ctx, { systemId, producedUnits }) {
    if (!player.hasTechnology('bellum-gloriosum')) {
      return
    }

    if (!producedUnits || producedUnits.length === 0) {
      return
    }

    // Count produced capacity-bearing ships
    const capacityShips = producedUnits.filter(
      u => u.category === 'ship' && (u.capacity || 0) > 0
    )

    if (capacityShips.length === 0) {
      return
    }

    // Total free units = number of capacity ships produced (1 per ship)
    const freeUnits = capacityShips.length

    // Calculate current available capacity in the system
    const systemUnits = ctx.state.units[systemId]
    if (!systemUnits) {
      return
    }

    const tile = ctx.game.res.getSystemTile(systemId) || ctx.game.res.getSystemTile(Number(systemId))

    // Find a planet with space dock for ground force placement
    let dockPlanet = null
    if (tile) {
      dockPlanet = tile.planets.find(pId => {
        const pu = systemUnits.planets[pId] || []
        return pu.some(u => u.owner === player.name && u.type === 'space-dock')
      })
      // If no space dock, use first controlled planet
      if (!dockPlanet) {
        dockPlanet = tile.planets.find(pId =>
          ctx.state.planets[pId]?.controller === player.name
        )
      }
    }

    let placed = 0
    for (let i = 0; i < freeUnits; i++) {
      const choices = ['infantry', 'fighter']
      if (!dockPlanet) {
        // No planet: can only place fighters in space
        choices.splice(0, 1) // remove infantry
      }
      if (choices.length === 0) {
        break
      }

      let unitType
      if (choices.length === 1) {
        unitType = choices[0]
      }
      else {
        const sel = ctx.actions.choose(player, choices, {
          title: `Bellum Gloriosum: Place free unit ${i + 1}/${freeUnits}`,
        })
        unitType = sel[0]
      }

      if (unitType === 'fighter') {
        ctx.game._addUnit(systemId, 'space', 'fighter', player.name)
      }
      else if (unitType === 'infantry' && dockPlanet) {
        ctx.game._addUnit(systemId, dockPlanet, 'infantry', player.name)
      }
      placed++
    }

    if (placed > 0) {
      ctx.log.add({
        template: 'Bellum Gloriosum: {player} places {count} free units',
        args: { player: player.name, count: placed },
      })
    }
  },

  // Commander effect for combat modifier system (backward compat)
  commanderEffect: {
    timing: 'ground-combat-modifier',
    apply: (player, context) => {
      if (context.timing !== 'ground-combat-modifier') {
        return 0
      }
      return 1
    },
  },
}
