module.exports = {
  id: "reap-hook-d067",
  name: "Reap Hook",
  deck: "minorD",
  number: 67,
  type: "minor",
  cost: { wood: 1 },
  category: "Crop Provider",
  text: "Place 1 grain on each of the next 3 of the round spaces 4, 7, 9, 11, 13, and 14. At the start of these rounds, you get the grain.",
  onPlay(game, player) {
    const currentRound = game.state.round
    const targetRounds = [4, 7, 9, 11, 13, 14].filter(r => r > currentRound).slice(0, 3)
    for (const round of targetRounds) {
      game.scheduleResource(player, 'grain', round, 1)
    }
    game.log.add({
      template: '{player} schedules grain from {card}',
      args: { player , card: this},
    })
  },
}
