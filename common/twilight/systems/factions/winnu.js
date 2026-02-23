module.exports = {
  getCustodiansCost() {
    return 0
  },

  onPlanetGained(player, ctx, { planetId, systemId }) {
    if (planetId !== 'mecatol-rex') {
      return
    }

    ctx.game._addUnitToPlanet(systemId, planetId, 'pds', player.name)
    ctx.game._addUnitToPlanet(systemId, planetId, 'space-dock', player.name)

    ctx.log.add({
      template: '{player} uses Reclamation: PDS and space dock on Mecatol Rex',
      args: { player },
    })
  },
}
