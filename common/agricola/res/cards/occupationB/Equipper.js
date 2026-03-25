module.exports = {
  id: "equipper-b131",
  name: "Equipper",
  deck: "occupationB",
  number: 131,
  type: "occupation",
  players: "1+",
  text: "Immediately after each time you use a wood accumulation space, you can play a minor improvement.",
  matches_onAction(game, player, actionId) {
    return game.isWoodAccumulationSpace(actionId)
  },
  onAction(game, player, _actionId) {
    game.actions.buyMinorImprovement(player)
  },
}
