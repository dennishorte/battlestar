module.exports = {
  id: "stock-protector-b094",
  name: "Stock Protector",
  deck: "occupationB",
  number: 94,
  type: "occupation",
  players: "1+",
  text: "Each time before you use the \"Fencing\" action space, you get 2 wood. Immediately after that \"Fencing\" action, you can place another person.",
  matches_onBeforeAction(_game, _player, actionId) {
    return actionId === 'fencing'
  },
  onBeforeAction(_game, player, _actionId) {
    player.addResource('wood', 2)
  },
  matches_onAction(game, player, actionId) {
    return actionId === 'fencing'
  },
  onAction(game, player, _actionId) {
    game.actions.offerExtraPerson(player, this)
  },
}
