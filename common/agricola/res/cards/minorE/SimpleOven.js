module.exports = {
  id: "simple-oven-e064",
  name: "Simple Oven",
  deck: "minorE",
  number: 64,
  type: "minor",
  cost: { clay: 2 },
  vps: 1,
  text: "For any \"Bake Bread\" action, you can convert exactly 1 grain into 3 food. When you build this improvement, you can immediately take a \"Bake Bread\" action.",
  bakingConversion: { from: "grain", to: "food", rate: 3, limit: 1 },
  onPlay(game, player) {
    if (player.hasBakingAbility() && player.grain >= 1) {
      game.actions.bakeBread(player)
    }
  },
}
