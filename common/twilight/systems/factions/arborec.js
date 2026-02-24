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
}
