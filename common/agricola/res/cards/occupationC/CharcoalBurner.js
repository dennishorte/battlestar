module.exports = {
  id: "charcoal-burner-c137",
  name: "Charcoal Burner",
  deck: "occupationC",
  number: 137,
  type: "occupation",
  players: "3+",
  text: "Each time any player (including you) plays or builds a baking improvement, you get 1 wood and 1 food.",
  // Note: onAnyBuildBakingImprovement hook is not fired by the engine.
  // This card's effect cannot be triggered in the current implementation.
  onAnyBuildBakingImprovement(game, actingPlayer, cardOwner) {
    cardOwner.addResource('wood', 1)
    cardOwner.addResource('food', 1)
    game.log.add({
      template: '{player} gets 1 wood and 1 food from Charcoal Burner',
      args: { player: cardOwner },
    })
  },
}
