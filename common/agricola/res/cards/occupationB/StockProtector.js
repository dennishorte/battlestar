module.exports = {
  id: "stock-protector-b094",
  name: "Stock Protector",
  deck: "occupationB",
  number: 94,
  type: "occupation",
  players: "1+",
  text: "Each time before you use the \"Fencing\" action space, you get 2 wood. Immediately after that \"Fencing\" action, you can place another person.",
  onBeforeAction(game, player, actionId) {
    if (actionId === 'fencing') {
      player.addResource('wood', 2)
      game.log.add({
        template: '{player} gets 2 wood from {card}',
        args: { player , card: this},
      })
    }
  },
  onAction(game, player, actionId) {
    if (actionId === 'fencing') {
      game.actions.offerExtraPerson(player, this)
    }
  },
}
