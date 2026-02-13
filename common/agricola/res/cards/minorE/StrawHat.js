module.exports = {
  id: "straw-hat-e010",
  name: "Straw Hat",
  deck: "minorE",
  number: 10,
  type: "minor",
  cost: { reed: 1 },
  text: "At the end of the work phases of rounds 3 and 6, you can move your person from the \"Farmland\" action space to an unoccupied action space and take that action, or get 1 food.",
  onWorkPhaseEnd(game, player) {
    if (game.state.round !== 3 && game.state.round !== 6) {
      return
    }

    // Check if this player used Farmland this round
    const farmlandState = game.state.actionSpaces['plow-field']
    if (!farmlandState || farmlandState.occupiedBy !== player.name) {
      return
    }

    // Temporarily free Farmland to check what's available
    farmlandState.occupiedBy = null
    player.availableWorkers += 1

    const available = game.getAvailableActions(player)
    // Exclude Farmland itself — moving back is pointless
    const filtered = available.filter(id => id !== 'plow-field')

    if (filtered.length === 0) {
      // No available actions to move to; restore state and give food
      farmlandState.occupiedBy = player.name
      player.availableWorkers -= 1
      player.addResource('food', 1)
      game.log.add({
        template: '{player} gets 1 food from {card} (no available actions)',
        args: { player, card: this },
      })
      return
    }

    // Restore state before offering choice
    farmlandState.occupiedBy = player.name
    player.availableWorkers -= 1

    const choices = ['Move from Farmland', 'Get 1 food']
    const selection = game.actions.choose(player, choices, {
      title: 'Straw Hat: Move person from Farmland?',
      min: 1,
      max: 1,
    })

    if (selection[0] === 'Get 1 food') {
      player.addResource('food', 1)
      game.log.add({
        template: '{player} gets 1 food from {card}',
        args: { player, card: this },
      })
      return
    }

    // Free Farmland and give worker back for the bonus turn
    farmlandState.occupiedBy = null
    player.availableWorkers += 1

    game.log.add({
      template: '{player} moves person from Farmland using {card}',
      args: { player, card: this },
    })
    game.log.indent()
    game.playerTurn(player, { isBonusTurn: true, allowedActions: filtered })
    game.log.outdent()
  },
}
