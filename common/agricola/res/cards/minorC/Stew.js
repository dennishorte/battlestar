module.exports = {
  id: "stew-c045",
  name: "Stew",
  deck: "minorC",
  number: 45,
  type: "minor",
  cost: { clay: 1 },
  category: "Food Provider",
  text: "Each time you use the \"Day Laborer\" action space, also place 1 food on each of the next 4 round spaces. At the start of these rounds, you get the food.",
  onAction(game, player, actionId) {
    if (actionId === 'day-laborer') {
      const currentRound = game.state.round
      for (let i = 1; i <= 4; i++) {
        const round = currentRound + i
        game.scheduleResource(player, 'food', round, 1)
      }
      game.log.add({
        template: '{player} schedules food from Stew',
        args: { player },
      })
    }
  },
}
