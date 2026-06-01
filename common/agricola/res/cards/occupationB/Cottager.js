module.exports = {
  id: "cottager-b087",
  name: "Cottager",
  deck: "occupationB",
  number: 87,
  type: "occupation",
  players: "1+",
  text: "Each time you use the \"Day Laborer\" action space, you can also either build exactly 1 room or renovate your house. Either way, you have to pay the cost.",
  matches_onAction(game, player, actionId) {
    return actionId === 'day-laborer'
  },
  onAction(game, player, _actionId) {
    const canBuildRoom = player.getValidRoomBuildSpaces().length > 0
      && player.getAffordableRoomCostOptions().length > 0
    const canRenovate = player.canRenovate()

    if (!canBuildRoom && !canRenovate) {
      return
    }

    const choices = []
    if (canBuildRoom) {
      choices.push(game.actions.option({ id: 'build-room', title: 'Build 1 Room' }))
    }
    if (canRenovate) {
      choices.push(game.actions.option({ id: 'renovate', title: 'Renovate' }))
    }
    choices.push(game.actions.option({ id: 'skip', title: 'Skip' }))

    const selection = game.actions.choose(player, choices, {
      title: 'Cottager: Build 1 Room or Renovate?',
      min: 1,
      max: 1,
    })

    if (selection[0].id === 'build-room') {
      game.actions.buildRoom(player)
    }
    else if (selection[0].id === 'renovate') {
      game.actions.renovate(player)
    }
  },
}
