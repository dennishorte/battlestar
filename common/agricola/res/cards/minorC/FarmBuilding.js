module.exports = {
  id: "farm-building-c043",
  name: "Farm Building",
  deck: "minorC",
  number: 43,
  type: "minor",
  cost: { clay: 1, reed: 1 },
  vps: 1,
  category: "Food Provider",
  text: "Each time you build a major improvement, place 1 food on each of the next 3 round spaces. At the start of these rounds, you get the food.",
  onBuildMajor(game, player) {
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
      template: '{player} schedules food from Farm Building',
      args: { player },
    })
  },
}
