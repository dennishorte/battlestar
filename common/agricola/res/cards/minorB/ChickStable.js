module.exports = {
  id: "chick-stable-b044",
  name: "Chick Stable",
  deck: "minorB",
  number: 44,
  type: "minor",
  cost: { wood: 1 },
  costAlternative: { clay: 1 },
  category: "Food Provider",
  text: "Add 3 and 4 to the current round and place 2 food on each corresponding round space. At the start of these rounds, you get the food.",
  onPlay(game, player) {
    const currentRound = game.state.round
    for (const offset of [3, 4]) {
      const round = currentRound + offset
      game.scheduleResource(player, 'food', round, 2)
    }
    game.log.add({
      template: '{player} schedules 2 food each for rounds from Chick Stable',
      args: { player },
    })
  },
}
