module.exports = {
  id: "chief-forester-a115",
  name: "Chief Forester",
  deck: "occupationA",
  number: 115,
  type: "occupation",
  players: "1+",
  text: "Each time you use a wood accumulation space, you also get a \"Sow\" action for exactly 1 field.",
  onAction(game, player, actionId) {
    const woodActions = ['take-wood', 'copse', 'take-3-wood', 'take-2-wood']
    if (woodActions.includes(actionId)) {
      game.actions.sowSingleField(player, this)
    }
  },
}
