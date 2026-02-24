module.exports = {
  votesFirst: true,

  getVotingModifier(player, ctx) {
    return ctx.players.all().length
  },

  getRaidFormationExcessHits(player, ctx, totalHits, fightersDestroyed) {
    return Math.max(0, totalHits - fightersDestroyed)
  },

  // Agent — Trillossa Aun Mirik: After a player activates a system, exhaust to
  // place 1 infantry from reinforcements on a planet in that system or adjacent
  // systems that the Argent player controls.
  onAnySystemActivated(argentPlayer, ctx, { systemId, activatingPlayer: _activatingPlayer }) {
    if (!argentPlayer.isAgentReady()) {
      return
    }

    // Gather planets the Argent player controls in the activated system and
    // adjacent systems
    const eligiblePlanets = []

    const systemIds = [systemId, ...ctx.game._getAdjacentSystems(systemId)]
    for (const sysId of systemIds) {
      const tile = ctx.game.res.getSystemTile(sysId) || ctx.game.res.getSystemTile(Number(sysId))
      if (!tile || tile.planets.length === 0) {
        continue
      }
      for (const planetId of tile.planets) {
        const planetState = ctx.state.planets[planetId]
        if (planetState && planetState.controller === argentPlayer.name) {
          eligiblePlanets.push({ planetId, systemId: sysId })
        }
      }
    }

    if (eligiblePlanets.length === 0) {
      return
    }

    const choice = ctx.actions.choose(argentPlayer, ['Exhaust Trillossa Aun Mirik', 'Pass'], {
      title: 'Trillossa Aun Mirik: Exhaust to place 1 infantry on a planet you control?',
    })

    if (choice[0] !== 'Exhaust Trillossa Aun Mirik') {
      return
    }

    argentPlayer.exhaustAgent()

    // Choose which planet to place infantry on
    let target
    if (eligiblePlanets.length === 1) {
      target = eligiblePlanets[0]
    }
    else {
      const planetChoices = eligiblePlanets.map(p => p.planetId)
      const planetChoice = ctx.actions.choose(argentPlayer, planetChoices, {
        title: 'Trillossa Aun Mirik: Choose planet for 1 infantry',
      })
      target = eligiblePlanets.find(p => p.planetId === planetChoice[0])
    }

    ctx.game._addUnit(target.systemId, target.planetId, 'infantry', argentPlayer.name)

    ctx.log.add({
      template: 'Trillossa Aun Mirik: {player} places 1 infantry on {planet}',
      args: { player: argentPlayer.name, planet: target.planetId },
    })
  },
}
