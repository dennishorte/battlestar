module.exports = {
  id: "trellises-a047",
  name: "Trellises",
  deck: "minorA",
  number: 47,
  type: "minor",
  cost: { wood: 1 },
  category: "Food Provider",
  text: "Immediately place 1 food on each of the next round spaces, up to the number of fences you have built. At the start of these rounds, you get the food.",
  onPlay(game, player) {
    const fences = player.getFenceCount()
    const currentRound = game.state.round
    for (let i = 1; i <= fences; i++) {
      const round = currentRound + i
      game.scheduleResource(player, 'food', round, 1)
    }
    if (fences > 0) {
      game.log.add({
        template: '{player} places food on the next {count} round spaces from Trellises',
        args: { player, count: Math.min(fences, 14 - currentRound) },
      })
    }
  },
}
