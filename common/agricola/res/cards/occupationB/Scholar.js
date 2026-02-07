module.exports = {
  id: "scholar-b097",
  name: "Scholar",
  deck: "occupationB",
  number: 97,
  type: "occupation",
  players: "1+",
  text: "Once you live in a stone house, at the start of each round, you can play an occupation for an occupation cost of 1 food, or a minor improvement (by paying its cost).",
  onRoundStart(game, player) {
    if (player.roomType === 'stone') {
      game.actions.offerScholarPlay(player, this)
    }
  },
}
