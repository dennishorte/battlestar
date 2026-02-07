module.exports = {
  id: "stable-tree-a074",
  name: "Stable Tree",
  deck: "minorA",
  number: 74,
  type: "minor",
  cost: { wood: 1 },
  category: "Building Resource Provider",
  text: "Each time you build 1 or more stables on your turn, place 1 wood on each of the next 3 round spaces. At the start of these rounds, you get the wood.",
  onBuildStable(game, player) {
    const currentRound = game.state.round
    for (let i = 1; i <= 3; i++) {
      const round = currentRound + i
      if (round <= 14) {
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
      template: '{player} places wood on the next 3 round spaces from Stable Tree',
      args: { player },
    })
  },
}
