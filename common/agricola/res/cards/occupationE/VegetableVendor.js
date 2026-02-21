module.exports = {
  id: "vegetable-vendor-e141",
  name: "Vegetable Vendor",
  deck: "occupationE",
  number: 141,
  type: "occupation",
  players: "1+",
  text: "Each time you use the \"Major Improvement\" or \"Vegetable Seeds\" action space, you also get 1 vegetable or a \"Major or Minor Improvement\" action, respectively.",
  onAction(game, player, actionId) {
    if (actionId === 'major-minor-improvement') {
      player.addResource('vegetables', 1)
      game.log.add({
        template: '{player} gets 1 vegetable from {card}',
        args: { player , card: this},
      })
    }
    else if (actionId === 'take-vegetable') {
      game.actions.buildImprovement(player)
    }
  },
}
