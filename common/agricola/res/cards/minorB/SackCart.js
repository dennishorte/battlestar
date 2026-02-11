module.exports = {
  id: "sack-cart-b066",
  name: "Sack Cart",
  deck: "minorB",
  number: 66,
  type: "minor",
  cost: { wood: 2 },
  prereqs: { occupations: 2 },
  category: "Crop Provider",
  text: "Place 1 grain each on the remaining spaces for rounds 5, 8, 11, and 14. At the start of these rounds, you get the grain.",
  onPlay(game, player) {
    const currentRound = game.state.round
    const targetRounds = [5, 8, 11, 14].filter(r => r > currentRound)
    for (const round of targetRounds) {
      game.scheduleResource(player, 'grain', round, 1)
    }
    game.log.add({
      template: '{player} schedules grain from Sack Cart',
      args: { player },
    })
  },
}
