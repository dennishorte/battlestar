module.exports = {
  id: "wood-worker-a164",
  name: "Wood Worker",
  deck: "occupationA",
  number: 164,
  type: "occupation",
  players: "4+",
  text: "Each time you take wood from an accumulation space, you can exchange 1 wood for 1 sheep. Place the wood on the accumulation space.",
  onAction(game, player, actionId) {
    const woodActions = ['take-wood', 'copse', 'take-3-wood', 'take-2-wood']
    if (woodActions.includes(actionId) && player.wood >= 1) {
      game.actions.offerWoodForSheepExchange(player, this, actionId)
    }
  },
}
