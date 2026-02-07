module.exports = {
  id: "iron-oven-e063",
  name: "Iron Oven",
  deck: "minorE",
  number: 63,
  type: "minor",
  cost: { stone: 3 },
  vps: 2,
  text: "For any \"Bake Bread\" action, you can convert exactly 1 grain into 6 food. When you build this improvement, you can immediately take a \"Bake Bread\" action.",
  bakingRate: 6,
  maxBakePerAction: 1,
  onPlay(game, player) {
    game.actions.offerBakeBread(player, this)
  },
}
