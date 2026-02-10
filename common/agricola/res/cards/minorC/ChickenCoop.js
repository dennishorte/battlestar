module.exports = {
  id: "chicken-coop-c044",
  name: "Chicken Coop",
  deck: "minorC",
  number: 44,
  type: "minor",
  cost: { wood: 2, reed: 1 },
  costAlternative: { clay: 2, reed: 1 },
  vps: 1,
  category: "Food Provider",
  text: "Place 1 food on each of the next 8 round spaces. At the start of these rounds, you get the food.",
  onPlay(game, player) {
    const currentRound = game.state.round
    for (let i = 1; i <= 8; i++) {
      const round = currentRound + i
      game.scheduleResource(player, 'food', round, 1)
    }
    game.log.add({
      template: '{player} schedules food from Chicken Coop',
      args: { player },
    })
  },
}
