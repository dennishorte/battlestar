module.exports = {
  id: "clay-hut-builder-a120",
  name: "Clay Hut Builder",
  deck: "occupationA",
  number: 120,
  type: "occupation",
  players: "1+",
  text: "Once you no longer live in a wooden house, place 2 clay on each of the next 5 round spaces. At the start of these rounds, you get the clay.",
  checkTrigger(game, player) {
    if (player.roomType !== 'wood' && !player.clayHutBuilderTriggered) {
      player.clayHutBuilderTriggered = true
      const currentRound = game.state.round
      for (let i = 1; i <= 5; i++) {
        const round = currentRound + i
        if (round <= 14) {
          if (!game.state.scheduledClay) {
            game.state.scheduledClay = {}
          }
          if (!game.state.scheduledClay[player.name]) {
            game.state.scheduledClay[player.name] = {}
          }
          game.state.scheduledClay[player.name][round] =
              (game.state.scheduledClay[player.name][round] || 0) + 2
        }
      }
      game.log.add({
        template: '{player} schedules clay from Clay Hut Builder',
        args: { player },
      })
    }
  },
}
