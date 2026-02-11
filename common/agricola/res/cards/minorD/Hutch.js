module.exports = {
  id: "hutch-d043",
  name: "Hutch",
  deck: "minorD",
  number: 43,
  type: "minor",
  cost: { wood: 1, reed: 1 },
  vps: 1,
  category: "Food Provider",
  text: "Place 0, 1, 2, and 3 food in this order on the next 4 round spaces. At the start of these rounds, you get the food.",
  onPlay(game, player) {
    const currentRound = game.state.round
    const foodAmounts = [0, 1, 2, 3]
    for (let i = 0; i < 4; i++) {
      const round = currentRound + 1 + i
      if (foodAmounts[i] > 0) {
        game.scheduleResource(player, 'food', round, foodAmounts[i])
      }
    }
    game.log.add({
      template: '{player} schedules food from Hutch',
      args: { player },
    })
  },
}
