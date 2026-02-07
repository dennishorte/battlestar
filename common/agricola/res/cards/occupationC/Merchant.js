module.exports = {
  id: "merchant-c096",
  name: "Merchant",
  deck: "occupationC",
  number: 96,
  type: "occupation",
  players: "1+",
  text: "Immediately after each time you take a \"Major or Minor Improvement\" or \"Minor Improvement\" action, you can pay 1 food to take the action a second time.",
  onAction(game, player, actionId) {
    if ((actionId === 'major-improvement' || actionId === 'minor-improvement') && player.food >= 1) {
      game.actions.offerMerchantRepeat(player, this, actionId)
    }
  },
}
