module.exports = {
  id: "confidant-b093",
  name: "Confidant",
  deck: "occupationB",
  number: 93,
  type: "occupation",
  players: "1+",
  text: "Place 1 food from your supply on each of the next 2, 3, or 4 round spaces. At the start of these rounds, you get the food back and your choice of a \"Sow\" or \"Build Fences\" action.",
  onPlay(game, player) {
    game.actions.offerConfidantSetup(player, this)
  },
}
