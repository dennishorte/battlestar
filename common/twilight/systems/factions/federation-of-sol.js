module.exports = {
  getStatusPhaseTokenBonus() {
    return 1
  },

  componentActions: [
    {
      id: 'orbital-drop',
      name: 'Orbital Drop',
      abilityId: 'orbital-drop',
      isAvailable: (player) => player.commandTokens.tactics >= 1,
    },
  ],

  orbitalDrop(ctx, player) {
    player.commandTokens.tactics -= 1

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
    }
  },

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
