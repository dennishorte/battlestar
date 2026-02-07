module.exports = {
  id: "club-house-b046",
  name: "Club House",
  deck: "minorB",
  number: 46,
  type: "minor",
  cost: { wood: 3 },
  costAlternative: { clay: 2 },
  vps: 1,
  category: "Building Resource Provider",
  text: "Place 1 food on each of the next 4 round spaces and 1 stone on the round space after that. At the start of these rounds, you get the respective good.",
  onPlay(game, player) {
    const currentRound = game.state.round
    for (let i = 1; i <= 4; i++) {
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
    const stoneRound = currentRound + 5
    if (stoneRound <= 14) {
      if (!game.state.scheduledStone) {
        game.state.scheduledStone = {}
      }
      if (!game.state.scheduledStone[player.name]) {
        game.state.scheduledStone[player.name] = {}
      }
      game.state.scheduledStone[player.name][stoneRound] =
          (game.state.scheduledStone[player.name][stoneRound] || 0) + 1
    }
    game.log.add({
      template: '{player} schedules food and stone from Club House',
      args: { player },
    })
  },
}
