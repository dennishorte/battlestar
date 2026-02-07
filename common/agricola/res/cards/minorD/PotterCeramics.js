module.exports = {
  id: "potter-ceramics-d066",
  name: "Potter Ceramics",
  deck: "minorD",
  number: 66,
  type: "minor",
  cost: {},
  category: "Food Provider",
  text: "Each time before you take a \"Bake Bread\" action, you can exchange exactly 1 clay for 1 grain.",
  onBeforeBake(game, player) {
    if (player.clay >= 1) {
      game.actions.offerPotterCeramics(player, this)
    }
  },
}
