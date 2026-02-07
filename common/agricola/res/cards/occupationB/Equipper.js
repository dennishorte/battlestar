module.exports = {
  id: "equipper-b131",
  name: "Equipper",
  deck: "occupationB",
  number: 131,
  type: "occupation",
  players: "1+",
  text: "Immediately after each time you use a wood accumulation space, you can play a minor improvement.",
  onAction(game, player, actionId) {
    const woodActions = ['take-wood', 'copse', 'take-3-wood', 'take-2-wood']
    if (woodActions.includes(actionId)) {
      game.actions.offerPlayMinorImprovement(player, this)
    }
  },
}
