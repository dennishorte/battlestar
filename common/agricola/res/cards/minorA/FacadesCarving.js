module.exports = {
  id: "facades-carving-a036",
  name: "Facades Carving",
  deck: "minorA",
  number: 36,
  type: "minor",
  cost: { clay: 2, reed: 1 },
  prereqs: { woodGteRound: true },
  category: "Points Provider",
  text: "When you play this card, you can exchange any number of food for 1 bonus point each, up to the number of completed harvests.",
  onPlay(game, player) {
    const harvests = game.getCompletedHarvestCount()
    if (harvests > 0 && player.food >= 1) {
      game.actions.offerFacadesCarving(player, this, harvests)
    }
  },
}
