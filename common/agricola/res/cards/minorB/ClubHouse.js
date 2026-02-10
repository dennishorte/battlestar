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
      game.scheduleResource(player, 'food', round, 1)
    }
    const stoneRound = currentRound + 5
    game.scheduleResource(player, 'stone', stoneRound, 1)
    game.log.add({
      template: '{player} schedules food and stone from Club House',
      args: { player },
    })
  },
}
