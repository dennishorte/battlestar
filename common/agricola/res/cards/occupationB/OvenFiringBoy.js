module.exports = {
  id: "oven-firing-boy-b108",
  name: "Oven Firing Boy",
  deck: "occupationB",
  number: 108,
  type: "occupation",
  players: "1+",
  text: "Each time you use a wood accumulation space, you get an additional \"Bake Bread\" action.",
  matches_onAction(game, player, actionId) {
    return game.isWoodAccumulationSpace(actionId)
  },
  onAction(game, player, _actionId) {
    game.actions.bakeBread(player)
  },
}
