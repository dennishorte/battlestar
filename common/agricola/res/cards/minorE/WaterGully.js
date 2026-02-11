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
      { round: currentRound + 1, type: 'cattle', amount: 1 },
      { round: currentRound + 2, type: 'grain', amount: 1 },
      { round: currentRound + 3, type: 'cattle', amount: 1 },
    ]
    for (const { round, type, amount } of schedule) {
      game.scheduleResource(player, type, round, amount)
    }
  },
}
