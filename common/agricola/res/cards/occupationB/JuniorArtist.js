module.exports = {
  id: "junior-artist-b152",
  name: "Junior Artist",
  deck: "occupationB",
  number: 152,
  type: "occupation",
  players: "3+",
  text: "Each time after you use the \"Day Laborer\" action space, you can pay 1 food to use an unoccupied \"Traveling Players\" or \"Lessons\" action space with the same person.",
  onAction(game, player, actionId) {
    if (actionId === 'day-laborer' && player.food >= 1) {
      const lessonsIds = ['occupation', 'lessons-3', 'lessons-4', 'lessons-5', 'lessons-5b']
      const options = []
      if (game.state.actionSpaces['traveling-players'] && !game.isActionOccupied('traveling-players')) {
        options.push('traveling-players')
      }
      for (const lid of lessonsIds) {
        if (game.state.actionSpaces[lid] && !game.isActionOccupied(lid)) {
          options.push(lid)
        }
      }
      if (options.length > 0) {
        const choices = options.map(id => {
          const action = game.getActionById(id)
          return `Use ${action ? action.name : id}`
        })
        choices.push('Skip')
        const selection = game.actions.choose(player, choices, {
          title: 'Junior Artist: Pay 1 food to use another space?',
          min: 1,
          max: 1,
        })
        if (selection[0] !== 'Skip') {
          const idx = choices.indexOf(selection[0])
          player.payCost({ food: 1 })
          game.actions.executeAction(player, options[idx])
        }
      }
    }
  },
}
