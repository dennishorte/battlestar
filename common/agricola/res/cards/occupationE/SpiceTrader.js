module.exports = {
  id: "spice-trader-e104",
  name: "Spice Trader",
  deck: "occupationE",
  number: 104,
  type: "occupation",
  players: "1+",
  text: "If you play this card in round 4 or before, place 3 vegetables on the space for round 11. At the start of that round, you get the vegetables.",
  onPlay(game, player) {
    if (game.state.round <= 4) {
      if (!game.state.scheduledVegetables) {
        game.state.scheduledVegetables = {}
      }
      if (!game.state.scheduledVegetables[player.name]) {
        game.state.scheduledVegetables[player.name] = {}
      }
      game.state.scheduledVegetables[player.name][11] =
          (game.state.scheduledVegetables[player.name][11] || 0) + 3
      game.log.add({
        template: '{player} schedules 3 vegetables for round 11 from Spice Trader',
        args: { player },
      })
    }
  },
}
