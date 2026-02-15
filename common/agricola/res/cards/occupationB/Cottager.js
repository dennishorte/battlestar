module.exports = {
  id: "cottager-b087",
  name: "Cottager",
  deck: "occupationB",
  number: 87,
  type: "occupation",
  players: "1+",
  text: "Each time you use the \"Day Laborer\" action space, you can also either build exactly 1 room or renovate your house. Either way, you have to pay the cost.",
  onAction(game, player, actionId) {
    if (actionId !== 'day-laborer') {
      return
    }

    const canBuildRoom = player.getValidRoomBuildSpaces().length > 0
      && player.getAffordableRoomCostOptions().length > 0
    const canRenovate = player.canRenovate()

    if (!canBuildRoom && !canRenovate) {
      return
    }

    const choices = []
    if (canBuildRoom) {
      choices.push('Build 1 Room')
    }
    if (canRenovate) {
      choices.push('Renovate')
    }
    choices.push('Skip')

    const selection = game.actions.choose(player, choices, {
      title: 'Cottager: Build 1 Room or Renovate?',
      min: 1,
      max: 1,
    })

    if (selection[0] === 'Build 1 Room') {
      game.actions.buildRoom(player)
    }
    else if (selection[0] === 'Renovate') {
      game.actions.renovate(player)
    }
  },
}
