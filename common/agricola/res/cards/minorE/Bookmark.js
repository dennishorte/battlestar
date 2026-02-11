module.exports = {
  id: "bookmark-e028",
  name: "Bookmark",
  deck: "minorE",
  number: 28,
  type: "minor",
  cost: { wood: 1 },
  text: "Add 3 to the current round and mark the corresponding round space. At the start of that round, you can play 1 occupation without paying an occupation cost.",
  onPlay(game, player) {
    const targetRound = game.state.round + 3
    game.scheduleEvent(player, 'freeOccupation', targetRound)
    game.log.add({
      template: '{player} marks round {round} for a free occupation',
      args: { player, round: targetRound },
    })
  },
}
