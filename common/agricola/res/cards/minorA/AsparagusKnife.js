module.exports = {
  id: "asparagus-knife-a058",
  name: "Asparagus Knife",
  deck: "minorA",
  number: 58,
  type: "minor",
  cost: { wood: 1 },
  category: "Crop Provider",
  text: "In the returning home phase of rounds 8, 10, and 12, you can take 1 vegetable from exactly 1 vegetable field. You can immediately exchange it for 3 food and 1 bonus point.",
  onReturnHome(game, player) {
    const round = game.state.round
    if ((round === 8 || round === 10 || round === 12) && player.getVegetableFieldCount() > 0) {
      game.actions.offerAsparagusKnife(player, this)
    }
  },
}
