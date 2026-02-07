module.exports = {
  id: "plumber-b128",
  name: "Plumber",
  deck: "occupationB",
  number: 128,
  type: "occupation",
  players: "1+",
  text: "Each time after you use the \"Major Improvement\" action space, you can take a \"Renovation\" action for 2 clay or 2 stone less.",
  onAction(game, player, actionId) {
    if (actionId === 'major-improvement') {
      game.actions.offerDiscountedRenovation(player, this, 2)
    }
  },
}
