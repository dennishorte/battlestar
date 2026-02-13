module.exports = {
  id: "tea-time-e003",
  name: "Tea Time",
  deck: "minorE",
  number: 3,
  type: "minor",
  cost: { food: 1 },
  prereqs: { personOnAction: "grain-utilization" },
  text: "Immediately return your person on the \"Grain Utilization\" action space home; you can place it again later this round.",
  onPlay(game, player) {
    const actionId = 'sow-bake' // Grain Utilization
    const state = game.state.actionSpaces[actionId]
    if (!state || state.occupiedBy !== player.name) {
      game.log.add({
        template: '{player} has no person on Grain Utilization for {card}',
        args: { player, card: this },
      })
      return
    }

    // Return worker from Grain Utilization
    state.occupiedBy = null
    player.availableWorkers += 1
    game.log.add({
      template: '{player} returns person from Grain Utilization using {card}',
      args: { player, card: this },
    })
  },
}
