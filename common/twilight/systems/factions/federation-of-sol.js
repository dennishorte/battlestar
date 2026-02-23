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
