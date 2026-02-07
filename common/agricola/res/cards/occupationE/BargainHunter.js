module.exports = {
  id: "bargain-hunter-e152",
  name: "Bargain Hunter",
  deck: "occupationE",
  number: 152,
  type: "occupation",
  players: "1+",
  text: "At the start of each round, you can place 1 food from your supply on the \"Traveling Players\" accumulation space to play a minor improvement by paying its cost.",
  onRoundStart(game, player) {
    if (player.food >= 1) {
      game.actions.offerBargainHunterMinor(player, this)
    }
  },
}
