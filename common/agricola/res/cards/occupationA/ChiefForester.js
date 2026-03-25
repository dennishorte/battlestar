module.exports = {
  id: "chief-forester-a115",
  name: "Chief Forester",
  deck: "occupationA",
  number: 115,
  type: "occupation",
  players: "1+",
  text: "Each time you use a wood accumulation space, you also get a \"Sow\" action for exactly 1 field.",
  matches_onAction(game, player, actionId) {
    return game.isWoodAccumulationSpace(actionId)
  },
  onAction(game, player, _actionId) {
    game.actions.sowSingleField(player, this)
  },
}
