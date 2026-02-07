module.exports = {
  id: "miller-e095",
  name: "Miller",
  deck: "occupationE",
  number: 95,
  type: "occupation",
  players: "1+",
  text: "You can immediately build a baking improvement by paying its cost. Each time another player uses the \"Grain Seeds\" action space, you can take a \"Bake Bread\" action.",
  onPlay(game, player) {
    game.actions.offerBuildBakingImprovement(player, this)
  },
  onAnyAction(game, actingPlayer, actionId, cardOwner) {
    if (actionId === 'take-grain' && actingPlayer.name !== cardOwner.name) {
      game.actions.offerBakeBread(cardOwner, this)
    }
  },
}
