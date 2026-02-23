const res = require('../../res/index.js')

module.exports = {
  afterDiplomacyResolved(player, ctx) {
    const controlledPlanets = player.getControlledPlanets()
    const adjacentPlanets = new Set()

    for (const planetId of controlledPlanets) {
      const systemId = ctx.game._findSystemForPlanet(planetId)
      if (!systemId) {
        continue
      }

      const adjacentSystems = ctx.game._getAdjacentSystems(systemId)
      for (const adjSystemId of adjacentSystems) {
        const tile = res.getSystemTile(adjSystemId) || res.getSystemTile(Number(adjSystemId))
        if (!tile) {
          continue
        }
        for (const adjPlanetId of tile.planets) {
          if (ctx.state.planets[adjPlanetId]?.controller === player.name) {
            continue
          }
          const planetUnits = ctx.state.units[adjSystemId]?.planets[adjPlanetId] || []
          if (planetUnits.length > 0) {
            continue
          }
          adjacentPlanets.add(adjPlanetId)
        }
      }
    }

    if (adjacentPlanets.size === 0) {
      return
    }

    const choices = ['Pass', ...adjacentPlanets]
    const selection = ctx.actions.choose(player, choices, {
      title: 'Peace Accords: Gain control of an unoccupied adjacent planet?',
    })

    if (selection[0] === 'Pass') {
      return
    }

    const targetPlanet = selection[0]
    const targetSystemId = ctx.game._findSystemForPlanet(targetPlanet)
    if (targetSystemId) {
      ctx.state.planets[targetPlanet].controller = player.name
      ctx.state.planets[targetPlanet].exhausted = true

      ctx.log.add({
        template: '{player} uses Peace Accords: gains control of {planet}',
        args: { player, planet: targetPlanet },
      })
    }
  },

  onAgendaRevealed(player, ctx, agenda) {
    if (player.commandTokens.strategy < 1) {
      return null
    }

    const choice = ctx.actions.choose(player, ['Quash', 'Pass'], {
      title: `Quash agenda "${agenda.name}"? (Spend 1 strategy token)`,
    })

    if (choice[0] === 'Quash') {
      player.commandTokens.strategy -= 1

      ctx.log.add({
        template: '{player} uses Quash: discards agenda',
        args: { player },
      })

      const replacement = ctx.game._drawAgendaCard()
      return replacement
    }

    return null
  },
}
