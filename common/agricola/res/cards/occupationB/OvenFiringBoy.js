module.exports = {
  id: "oven-firing-boy-b108",
  name: "Oven Firing Boy",
  deck: "occupationB",
  number: 108,
  type: "occupation",
  players: "1+",
  text: "Each time you use a wood accumulation space, you get an additional \"Bake Bread\" action.",
  onAction(game, player, actionId) {
    const woodActions = ['take-wood', 'copse', 'take-3-wood', 'take-2-wood']
    if (woodActions.includes(actionId)) {
      game.actions.offerBakeBread(player, this)
    }
  },
}
