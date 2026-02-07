module.exports = {
  id: "paper-maker-b109",
  name: "Paper Maker",
  deck: "occupationB",
  number: 109,
  type: "occupation",
  players: "1+",
  text: "Immediately before playing each occupation after this one, you can pay 1 wood total to get 1 food for each occupation you have in front of you.",
  onBeforePlayOccupation(game, player) {
    if (player.wood >= 1) {
      game.actions.offerPaperMakerBonus(player, this)
    }
  },
}
