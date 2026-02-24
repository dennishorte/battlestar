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
      if (player.getAvailableResources?.() >= 3) {
        const mechChoice = ctx.actions.choose(player, ['Deploy Mech', 'Pass'], {
          title: 'ZS Thunderbolt M2 DEPLOY: Spend 3 resources to place 1 mech?',
        })
        if (mechChoice[0] === 'Deploy Mech') {
          player.spendResources(3)
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
  onGroundCombatStart(player, ctx, { systemId, planetId, opponentName: _opponentName }) {
    if (!player.isCommanderUnlocked()) {
      return
    }

    // Check if player controls the planet (is the defender)
    const planetUnits = ctx.state.units[systemId]?.planets[planetId] || []
    const hasGroundForces = planetUnits.some(u => u.owner === player.name)
    if (!hasGroundForces) {
      return
    }

    ctx.game._addUnitToPlanet(systemId, planetId, 'infantry', player.name)
    ctx.log.add({
      template: 'Claire Gibson: {player} places 1 infantry on {planet}',
      args: { player: player.name, planet: planetId },
    })
  },

  // Agent: Evelyn Delouis — at start of ground combat round, exhaust to give 1 ground force extra die
  // This would need a per-round hook in ground combat; tracked via onGroundCombatStart for first round
  onGroundCombatRoundEnd(_player, _ctx, _context) {
    // Placeholder: agent implementation needs per-round ground combat hook
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
