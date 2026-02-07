module.exports = {
  id: "new-purchase-b070",
  name: "New Purchase",
  deck: "minorB",
  number: 70,
  type: "minor",
  cost: {},
  category: "Crop Provider",
  text: "Before the start of each round that ends with a harvest, you can buy one of each of the following crops: 2 food → 1 grain; 4 food → 1 vegetable.",
  onRoundStart(game, player, round) {
    if (game.isHarvestRound(round) && (player.food >= 2)) {
      game.actions.offerNewPurchase(player, this)
    }
  },
}
