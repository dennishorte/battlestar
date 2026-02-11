module.exports = {
  id: "private-forest-c074",
  name: "Private Forest",
  deck: "minorC",
  number: 74,
  type: "minor",
  cost: { food: 2 },
  prereqs: { occupations: 1 },
  category: "Building Resource Provider",
  text: "Place 1 wood on each remaining even-numbered round space. At the start of these rounds, you get the wood.",
  onPlay(game, player) {
    const currentRound = game.state.round
    for (let round = 2; round <= 14; round += 2) {
      if (round > currentRound) {
        game.scheduleResource(player, 'wood', round, 1)
      }
    }
    game.log.add({
      template: '{player} schedules wood from Private Forest',
      args: { player },
    })
  },
}
