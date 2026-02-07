module.exports = {
  id: "barn-cats-e043",
  name: "Barn Cats",
  deck: "minorE",
  number: 43,
  type: "minor",
  cost: {},
  vps: 1,
  prereqs: { stables: 1 },
  text: "If you have 1/2/3/4 stables, place 1 food on each of the next 2/3/4/5 round spaces. At the start of these rounds, you get the food.",
  onPlay(game, player) {
    const stables = player.getStableCount()
    const rounds = Math.min(stables + 1, 5)
    const currentRound = game.state.round
    for (let i = 1; i <= rounds; i++) {
      const round = currentRound + i
      if (round <= 14) {
        if (!game.state.scheduledFood) {
          game.state.scheduledFood = {}
        }
        if (!game.state.scheduledFood[player.name]) {
          game.state.scheduledFood[player.name] = {}
        }
        game.state.scheduledFood[player.name][round] =
            (game.state.scheduledFood[player.name][round] || 0) + 1
      }
    }
  },
}
