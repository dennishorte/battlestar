module.exports = {
  id: "granary-c065",
  name: "Granary",
  deck: "minorC",
  number: 65,
  type: "minor",
  cost: { wood: 3 },
  costAlternative: { clay: 3 },
  vps: 1,
  category: "Crop Provider",
  text: "Place 1 grain each on the remaining spaces for rounds 8, 10, and 12. At the start of these rounds, you get the grain.",
  onPlay(game, player) {
    const currentRound = game.state.round
    const targetRounds = [8, 10, 12].filter(r => r > currentRound)
    for (const round of targetRounds) {
      game.scheduleResource(player, 'grain', round, 1)
    }
    game.log.add({
      template: '{player} schedules grain from Granary',
      args: { player },
    })
  },
}
