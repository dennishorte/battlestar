module.exports = {
  id: "sample-stable-maker-d102",
  name: "Sample Stable Maker",
  deck: "occupationD",
  number: 102,
  type: "occupation",
  players: "1+",
  text: "At the start of each returning home phase, you can return a built stable to your supply to get 1 wood, 1 grain, 1 food, and a \"Minor Improvement\" action.",
  onReturnHomeStart(game, player) {
    if (player.getBuiltStableCount() > 0) {
      game.actions.offerSampleStableMakerReturn(player, this)
    }
  },
}
