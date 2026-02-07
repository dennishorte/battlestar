module.exports = {
  id: "fruit-ladder-e045",
  name: "Fruit Ladder",
  deck: "minorE",
  number: 45,
  type: "minor",
  cost: { wood: 2 },
  vps: 1,
  text: "Place 1 food on each remaining even-numbered round space. At the start of these rounds, you get the food.",
  onPlay(game, player) {
    const currentRound = game.state.round
    for (let round = currentRound + 1; round <= 14; round++) {
      if (round % 2 === 0) {
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
