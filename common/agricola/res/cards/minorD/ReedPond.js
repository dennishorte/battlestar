module.exports = {
  id: "reed-pond-d078",
  name: "Reed Pond",
  deck: "minorD",
  number: 78,
  type: "minor",
  cost: {},
  prereqs: { occupations: 3 },
  category: "Building Resource Provider",
  text: "Place 1 reed on each of the next 3 round spaces. At the start of these rounds, you get the reed.",
  onPlay(game, player) {
    const currentRound = game.state.round
    for (let i = 1; i <= 3; i++) {
      const round = currentRound + i
      if (round <= 14) {
        if (!game.state.scheduledReed) {
          game.state.scheduledReed = {}
        }
        if (!game.state.scheduledReed[player.name]) {
          game.state.scheduledReed[player.name] = {}
        }
        game.state.scheduledReed[player.name][round] =
            (game.state.scheduledReed[player.name][round] || 0) + 1
      }
    }
    game.log.add({
      template: '{player} schedules reed from Reed Pond',
      args: { player },
    })
  },
}
