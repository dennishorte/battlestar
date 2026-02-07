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
      const options = []
      if (!game.isActionOccupied('traveling-players')) {
        options.push('traveling-players')
      }
      if (!game.isActionOccupied('lessons-1')) {
        options.push('lessons-1')
      }
      if (!game.isActionOccupied('lessons-2')) {
        options.push('lessons-2')
      }
      if (options.length > 0) {
        game.actions.offerUseOtherSpaceChoice(player, this, options, { cost: { food: 1 } })
      }
    }
  },
}
