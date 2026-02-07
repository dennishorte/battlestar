module.exports = {
  id: "thick-forest-b074",
  name: "Thick Forest",
  deck: "minorB",
  number: 74,
  type: "minor",
  cost: {},
  prereqs: { clay: 5 },
  category: "Building Resource Provider",
  text: "Place 1 wood on each remaining even-numbered round space. At the start of these rounds, you get the wood.",
  onPlay(game, player) {
    const currentRound = game.state.round
    for (let round = 2; round <= 14; round += 2) {
      if (round > currentRound) {
        if (!game.state.scheduledWood) {
          game.state.scheduledWood = {}
        }
        if (!game.state.scheduledWood[player.name]) {
          game.state.scheduledWood[player.name] = {}
        }
        game.state.scheduledWood[player.name][round] =
            (game.state.scheduledWood[player.name][round] || 0) + 1
      }
    }
    game.log.add({
      template: '{player} schedules wood from Thick Forest',
      args: { player },
    })
  },
}
