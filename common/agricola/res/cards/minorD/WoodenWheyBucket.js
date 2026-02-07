module.exports = {
  id: "wooden-whey-bucket-d016",
  name: "Wooden Whey Bucket",
  deck: "minorD",
  number: 16,
  type: "minor",
  cost: { wood: 1, food: 1 },
  category: "Farm Planner",
  text: "Each time before you use the \"Sheep Market\"/\"Cattle Market\" accumulation space, you can build exactly 1 stable for 1 wood/at no cost.",
  onBeforeAction(game, player, actionId) {
    if (actionId === 'take-sheep') {
      game.actions.offerBuildStableForWood(player, this, 1)
    }
    else if (actionId === 'take-cattle') {
      game.actions.buildFreeStable(player, this)
    }
  },
}
