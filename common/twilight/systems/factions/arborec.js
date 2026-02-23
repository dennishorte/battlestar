module.exports = {
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
}
