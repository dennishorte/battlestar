module.exports = {
  id: "waterlily-pond-e046",
  name: "Waterlily Pond",
  deck: "minorE",
  number: 46,
  type: "minor",
  cost: {},
  vps: 1,
  prereqs: { exactlyOccupations: 2 },
  text: "Place 1 food on each of the next 2 round spaces. At the start of these rounds, you get the food.",
  onPlay(game, player) {
    const currentRound = game.state.round
    for (let i = 1; i <= 2; i++) {
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
  },
}
