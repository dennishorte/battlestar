module.exports = {
  id: "spin-doctor-d151",
  name: "Spin Doctor",
  deck: "occupationD",
  number: 151,
  type: "occupation",
  players: "1+",
  text: "Immediately after each time you use the \"Traveling Players\" accumulation space, you can place another person on an action space of your choice, regardless whether or not the action space is occupied.",
  onAction(game, player, actionId) {
    if (actionId !== 'traveling-players') {
      return
    }
    if (player.getAvailableWorkers() <= 0) {
      return
    }

    const available = game.getAvailableActions(player, { allowOccupied: true })
    if (available.length === 0) {
      return
    }

    const choices = available.map(id => {
      const action = game.getActionById(id)
      const state = game.state.actionSpaces[id]
      return action ? action.name : (state?.name || id)
    })
    choices.push('Skip')

    const selection = game.actions.choose(player, choices, {
      title: 'Spin Doctor: Place another person on any action space',
      min: 1,
      max: 1,
    })

    if (selection[0] === 'Skip') {
      return
    }

    const selectedName = selection[0]
    const selectedActionId = available.find(id => {
      const action = game.getActionById(id)
      const state = game.state.actionSpaces[id]
      return (action ? action.name : (state?.name || id)) === selectedName
    })

    if (selectedActionId) {
      game.state.actionSpaces[selectedActionId].occupiedBy = player.name
      player.useWorker()
      game.actions.executeAction(player, selectedActionId)
    }
  },
}
