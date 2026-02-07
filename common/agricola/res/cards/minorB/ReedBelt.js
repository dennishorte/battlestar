module.exports = {
  id: "reed-belt-b078",
  name: "Reed Belt",
  deck: "minorB",
  number: 78,
  type: "minor",
  cost: { food: 2 },
  category: "Building Resource Provider",
  text: "Place 1 reed on each remaining space for rounds 5, 8, 10, and 12. At the start of these rounds, you get the reed.",
  onPlay(game, player) {
    const currentRound = game.state.round
    const targetRounds = [5, 8, 10, 12].filter(r => r > currentRound)
    for (const round of targetRounds) {
      if (!game.state.scheduledReed) {
        game.state.scheduledReed = {}
      }
      if (!game.state.scheduledReed[player.name]) {
        game.state.scheduledReed[player.name] = {}
      }
      game.state.scheduledReed[player.name][round] =
          (game.state.scheduledReed[player.name][round] || 0) + 1
    }
    game.log.add({
      template: '{player} schedules reed from Reed Belt',
      args: { player },
    })
  },
}
