module.exports = {
  id: "horse-drawn-boat-d041",
  name: "Horse-Drawn Boat",
  deck: "minorD",
  number: 41,
  type: "minor",
  cost: { wood: 2 },
  prereqs: { occupations: 3 },
  category: "Food Provider",
  text: "Alternate placing 1 food and 1 sheep on each remaining round space, starting with food. At the start of these rounds, you get the respective good.",
  onPlay(game, player) {
    const currentRound = game.state.round
    let isFood = true
    for (let round = currentRound + 1; round <= 14; round++) {
      if (isFood) {
        if (!game.state.scheduledFood) {
          game.state.scheduledFood = {}
        }
        if (!game.state.scheduledFood[player.name]) {
          game.state.scheduledFood[player.name] = {}
        }
        game.state.scheduledFood[player.name][round] =
            (game.state.scheduledFood[player.name][round] || 0) + 1
      }
      else {
        if (!game.state.scheduledSheep) {
          game.state.scheduledSheep = {}
        }
        if (!game.state.scheduledSheep[player.name]) {
          game.state.scheduledSheep[player.name] = {}
        }
        game.state.scheduledSheep[player.name][round] =
            (game.state.scheduledSheep[player.name][round] || 0) + 1
      }
      isFood = !isFood
    }
    game.log.add({
      template: '{player} schedules food and sheep from Horse-Drawn Boat',
      args: { player },
    })
  },
}
