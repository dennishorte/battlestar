module.exports = {
  id: "basket-a056",
  name: "Basket",
  deck: "minorA",
  number: 56,
  type: "minor",
  cost: { reed: 1 },
  category: "Food Provider",
  text: "Immediately after each time you use a wood accumulation space, you can exchange 2 wood for 3 food. If you do, place those 2 wood on the accumulation space.",
  onAction(game, player, actionId) {
    if (actionId === 'take-wood' || actionId === 'copse' || actionId === 'take-3-wood' || actionId === 'take-2-wood') {
      if (player.wood >= 2) {
        game.actions.offerWoodForFoodExchange(player, this, { wood: 2, food: 3 })
      }
    }
  },
}
