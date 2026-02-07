module.exports = {
  id: "beer-stein-c061",
  name: "Beer Stein",
  deck: "minorC",
  number: 61,
  type: "minor",
  cost: { clay: 1 },
  category: "Food Provider",
  text: "Each time you take a \"Bake Bread\" action, you can use this card once to turn 1 grain into 2 food and 1 bonus point.",
  onBake(game, player) {
    if (player.grain >= 1) {
      game.actions.offerBeerStein(player, this)
    }
  },
}
