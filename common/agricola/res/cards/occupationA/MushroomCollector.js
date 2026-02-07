module.exports = {
  id: "mushroom-collector-a108",
  name: "Mushroom Collector",
  deck: "occupationA",
  number: 108,
  type: "occupation",
  players: "1+",
  text: "Immediately after each time you use a wood accumulation space, you can exchange 1 wood for 2 food. If you do, place the wood on the accumulation space.",
  onAction(game, player, actionId) {
    const woodActions = ['take-wood', 'copse', 'take-3-wood', 'take-2-wood']
    if (woodActions.includes(actionId) && player.wood >= 1) {
      game.actions.offerWoodForFoodExchange(player, this, { wood: 1, food: 2 })
    }
  },
}
