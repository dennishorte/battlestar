module.exports = {
  id: "fodder-beets-e044",
  name: "Fodder Beets",
  deck: "minorE",
  number: 44,
  type: "minor",
  cost: {},
  vps: 1,
  prereqs: { fields: 3 },
  text: "Place 1 food on each remaining odd-numbered round space. At the start of these rounds, you get the food.",
  onPlay(game, player) {
    const currentRound = game.state.round
    for (let round = currentRound + 1; round <= 14; round++) {
      if (round % 2 === 1) {
        game.scheduleResource(player, 'food', round, 1)
      }
    }
  },
}
