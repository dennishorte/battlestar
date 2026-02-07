module.exports = {
  id: "tree-guard-c102",
  name: "Tree Guard",
  deck: "occupationC",
  number: 102,
  type: "occupation",
  players: "1+",
  text: "Each time after you use a wood accumulation space, you can place 4 wood from your supply on that space to get 2 stone, 1 clay, 1 reed, and 1 grain.",
  onAction(game, player, actionId) {
    const woodActions = ['take-wood', 'copse', 'take-3-wood', 'take-2-wood']
    if (woodActions.includes(actionId) && player.wood >= 4) {
      game.actions.offerTreeGuardExchange(player, this, actionId)
    }
  },
}
