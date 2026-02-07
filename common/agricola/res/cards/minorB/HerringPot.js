module.exports = {
  id: "herring-pot-b047",
  name: "Herring Pot",
  deck: "minorB",
  number: 47,
  type: "minor",
  cost: { clay: 1 },
  category: "Food Provider",
  text: "Each time you use the \"Fishing\" accumulation space, place 1 food on each of the next 3 round spaces. At the start of these rounds, you get the food.",
  onAction(game, player, actionId) {
    if (actionId === 'fishing') {
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
        template: '{player} places food on the next 3 round spaces from Herring Pot',
        args: { player },
      })
    }
  },
}
