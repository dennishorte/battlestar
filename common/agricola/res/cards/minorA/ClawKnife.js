module.exports = {
  id: "claw-knife-a046",
  name: "Claw Knife",
  deck: "minorA",
  number: 46,
  type: "minor",
  cost: { wood: 1 },
  prereqs: { pastures: 1, pasturesExact: true },
  category: "Food Provider",
  text: "Each time you use the \"Sheep Market\" accumulation space, place 1 food on each of the next 2 round spaces. At the start of these rounds, you get the food.",
  onAction(game, player, actionId) {
    if (actionId === 'take-sheep') {
      const currentRound = game.state.round
      for (let i = 1; i <= 2; i++) {
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
        template: '{player} places food on the next 2 round spaces from Claw Knife',
        args: { player },
      })
    }
  },
}
