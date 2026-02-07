module.exports = {
  id: "land-heir-e119",
  name: "Land Heir",
  deck: "occupationE",
  number: 119,
  type: "occupation",
  players: "1+",
  text: "If you play this card in round 4 or before, place 4 wood and 4 clay on the space for round 9. At the start of this round, you get the resources.",
  onPlay(game, player) {
    if (game.state.round <= 4) {
      if (!game.state.scheduledWood) {
        game.state.scheduledWood = {}
      }
      if (!game.state.scheduledWood[player.name]) {
        game.state.scheduledWood[player.name] = {}
      }
      game.state.scheduledWood[player.name][9] =
          (game.state.scheduledWood[player.name][9] || 0) + 4

      if (!game.state.scheduledClay) {
        game.state.scheduledClay = {}
      }
      if (!game.state.scheduledClay[player.name]) {
        game.state.scheduledClay[player.name] = {}
      }
      game.state.scheduledClay[player.name][9] =
          (game.state.scheduledClay[player.name][9] || 0) + 4

      game.log.add({
        template: '{player} schedules 4 wood and 4 clay for round 9 from Land Heir',
        args: { player },
      })
    }
  },
}
