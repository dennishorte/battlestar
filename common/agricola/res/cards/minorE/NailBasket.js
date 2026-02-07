module.exports = {
  id: "nail-basket-e015",
  name: "Nail Basket",
  deck: "minorE",
  number: 15,
  type: "minor",
  cost: { reed: 1 },
  vps: 1,
  text: "Each time after you use a wood accumulation space, you can place 1 stone from your supply on that space (for the next visitor) to take a \"Build Fences\" action.",
  onAction(game, player, actionId) {
    const woodActions = ['forest', 'grove', 'copse']
    if (woodActions.includes(actionId) && player.stone >= 1) {
      game.actions.offerNailBasket(player, this, actionId)
    }
  },
}
