module.exports = {
  id: "trap-builder-d147",
  name: "Trap Builder",
  deck: "occupationD",
  number: 147,
  type: "occupation",
  players: "1+",
  text: "Each time you use the \"Day Laborer\" action space, place 1 food, 1 food, and 1 wild boar on the next 3 round spaces, respectively. At the start of these rounds, you get the good.",
  onAction(game, player, actionId) {
    if (actionId === 'day-laborer') {
      const currentRound = game.state.round
      const goods = ['food', 'food', 'boar']
      for (let i = 0; i < 3; i++) {
        const round = currentRound + i + 1
        if (round <= 14) {
          const good = goods[i]
          if (good === 'boar') {
            if (!game.state.scheduledBoar) {
              game.state.scheduledBoar = {}
            }
            if (!game.state.scheduledBoar[player.name]) {
              game.state.scheduledBoar[player.name] = {}
            }
            game.state.scheduledBoar[player.name][round] =
                (game.state.scheduledBoar[player.name][round] || 0) + 1
          }
          else {
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
      }
      game.log.add({
        template: '{player} schedules 1 food, 1 food, 1 wild boar from Trap Builder',
        args: { player },
      })
    }
  },
}
