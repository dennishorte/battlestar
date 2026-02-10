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
      game.scheduleResource(player, 'food', round, 1)
    }
  },
}
