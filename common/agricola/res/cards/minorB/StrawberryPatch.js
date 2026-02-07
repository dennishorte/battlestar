module.exports = {
  id: "strawberry-patch-b045",
  name: "Strawberry Patch",
  deck: "minorB",
  number: 45,
  type: "minor",
  cost: { wood: 1 },
  vps: 2,
  prereqs: { vegetableFields: 2 },
  category: "Food Provider",
  text: "Place 1 food on each of the next 3 round spaces. At the start of these rounds, you get the food.",
  onPlay(game, player) {
    const currentRound = game.state.round
    for (let i = 1; i <= 3; i++) {
      const round = currentRound + i
      if (round <= 14) {
        if (!game.state.scheduledFood) {
          game.state.scheduledFood = {}
        }
        if (!game.state.scheduledFood[player.name]) {
          game.state.scheduledFood[player.name] = {}
        }
        game.state.scheduledFood[player.name][round] =
            (game.state.scheduledFood[player.name][round] || 0) + 1
      }
    }
    game.log.add({
      template: '{player} places food on the next 3 round spaces from Strawberry Patch',
      args: { player },
    })
  },
}
