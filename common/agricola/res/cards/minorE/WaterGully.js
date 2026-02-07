module.exports = {
  id: "water-gully-e042",
  name: "Water Gully",
  deck: "minorE",
  number: 42,
  type: "minor",
  cost: { stone: 1 },
  prereqs: { majorImprovement: "well" },
  text: "Place 1 cattle, 1 grain, and 1 cattle on the next 3 round spaces (in that order). At the start of these rounds, you get the respective good.",
  onPlay(game, player) {
    const currentRound = game.state.round
    const schedule = [
      { round: currentRound + 1, type: 'scheduledCattle', amount: 1 },
      { round: currentRound + 2, type: 'scheduledGrain', amount: 1 },
      { round: currentRound + 3, type: 'scheduledCattle', amount: 1 },
    ]
    for (const { round, type, amount } of schedule) {
      if (round <= 14) {
        if (!game.state[type]) {
          game.state[type] = {}
        }
        if (!game.state[type][player.name]) {
          game.state[type][player.name] = {}
        }
        game.state[type][player.name][round] =
            (game.state[type][player.name][round] || 0) + amount
      }
    }
  },
}
