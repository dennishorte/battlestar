module.exports = {
  id: "lumberjack-b119",
  name: "Lumberjack",
  deck: "occupationB",
  number: 119,
  type: "occupation",
  players: "1+",
  text: "Immediately place 1 wood on each of the next round spaces, up to the number of fences you built. At the start of these rounds, you get the wood.",
  onPlay(game, player) {
    const fenceCount = player.getFenceCount()
    const currentRound = game.state.round
    for (let i = 1; i <= fenceCount && currentRound + i <= 14; i++) {
      const round = currentRound + i
      if (!game.state.scheduledWood) {
        game.state.scheduledWood = {}
      }
      if (!game.state.scheduledWood[player.name]) {
        game.state.scheduledWood[player.name] = {}
      }
      game.state.scheduledWood[player.name][round] =
          (game.state.scheduledWood[player.name][round] || 0) + 1
    }
    game.log.add({
      template: '{player} schedules wood from Lumberjack',
      args: { player },
    })
  },
}
