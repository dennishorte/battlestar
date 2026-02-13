module.exports = {
  id: "ravenous-hunger-c042",
  name: "Ravenous Hunger",
  deck: "minorC",
  number: 42,
  type: "minor",
  cost: { grain: 1 },
  category: "Actions Booster",
  text: "Immediately after each time you use the \"Vegetable Seeds\" action space, you can place another person on an accumulation space and get 1 additional good of the accumulating type.",
  onAction(game, player, actionId) {
    if (actionId !== 'take-vegetable') {
      return
    }

    if (player.getAvailableWorkers() <= 0) {
      return
    }

    // Find available accumulation spaces
    const available = game.getAvailableActions(player)
    const accumSpaces = available.filter(id => {
      const action = game.getActionById(id)
      return action && action.type === 'accumulating'
    })

    if (accumSpaces.length === 0) {
      return
    }

    const choices = ['Use Ravenous Hunger', 'Skip']
    const selection = game.actions.choose(player, choices, {
      title: 'Ravenous Hunger: Place a person on an accumulation space?',
      min: 1,
      max: 1,
    })

    if (selection[0] === 'Skip') {
      return
    }

    game.log.add({
      template: '{player} uses {card} to place a person on an accumulation space',
      args: { player, card: this },
    })

    // Record which spaces were occupied before the bonus turn
    const occupiedBefore = {}
    for (const id of accumSpaces) {
      occupiedBefore[id] = game.state.actionSpaces[id].occupiedBy
    }

    game.log.indent()
    game.playerTurn(player, { isBonusTurn: true, allowedActions: accumSpaces })
    game.log.outdent()

    // Find which space they chose (newly occupied)
    for (const id of accumSpaces) {
      const state = game.state.actionSpaces[id]
      if (state.occupiedBy === player.name && occupiedBefore[id] !== player.name) {
        const action = game.getActionById(id)
        if (action && action.accumulates) {
          for (const [resource] of Object.entries(action.accumulates)) {
            player.addResource(resource, 1)
            game.log.add({
              template: '{player} gets 1 additional {resource} from {card}',
              args: { player, resource, card: this },
            })
          }
        }
        break
      }
    }
  },
}
