module.exports = {
  id: "angler-a095",
  name: "Angler",
  deck: "occupationA",
  number: 95,
  type: "occupation",
  players: "1+",
  text: "Each time after you use the \"Fishing\" Accumulation space while there are at most 2 food on that space, you get a \"Major or Minor Improvement\" action.",
  matches_onAction(game, player, actionId) {
    return actionId === 'fishing'
  },
  onAction(game, player, _actionId) {
    const foodOnSpace = game.getAccumulatedResources('fishing').food || 0
    if (foodOnSpace <= 2) {
      game.actions.buyImprovement(player, true, true)
    }
  },
}
