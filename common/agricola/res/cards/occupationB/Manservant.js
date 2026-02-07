module.exports = {
  id: "manservant-b107",
  name: "Manservant",
  deck: "occupationB",
  number: 107,
  type: "occupation",
  players: "1+",
  text: "Once you live in a stone house, place 3 food on each remaining round space. At the start of these rounds, you get the food.",
  checkTrigger(game, player) {
    if (player.roomType === 'stone' && !player.manservantTriggered) {
      player.manservantTriggered = true
      const currentRound = game.state.round
      for (let round = currentRound + 1; round <= 14; round++) {
        if (!game.state.scheduledFood) {
          game.state.scheduledFood = {}
        }
        if (!game.state.scheduledFood[player.name]) {
          game.state.scheduledFood[player.name] = {}
        }
        game.state.scheduledFood[player.name][round] =
            (game.state.scheduledFood[player.name][round] || 0) + 3
      }
      game.log.add({
        template: '{player} schedules 3 food per round from Manservant',
        args: { player },
      })
    }
  },
}
