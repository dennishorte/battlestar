module.exports = {
  id: "brewing-water-b060",
  name: "Brewing Water",
  deck: "minorB",
  number: 60,
  type: "minor",
  cost: {},
  category: "Food Provider",
  text: "Each time you use the \"Fishing\" accumulation space, you can pay 1 grain to place 1 food on each of the next 6 round spaces. At the start of these rounds, you get the food.",
  onAction(game, player, actionId) {
    if (actionId === 'fishing' && player.grain >= 1) {
      game.actions.offerBrewingWater(player, this)
    }
  },
}
