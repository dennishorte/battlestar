module.exports = {
  id: "charcoal-burner-c137",
  name: "Charcoal Burner",
  deck: "occupationC",
  number: 137,
  type: "occupation",
  players: "3+",
  text: "Each time any player (including you) plays or builds a baking improvement, you get 1 wood and 1 food.",
  onAnyBuildMajor(game, actingPlayer, cardOwner, improvementId) {
    const imp = game.cards.byId(improvementId)
    if (imp && imp.abilities && imp.abilities.canBake) {
      cardOwner.addResource('wood', 1)
      cardOwner.addResource('food', 1)
      game.log.add({
        template: '{player} gets 1 wood and 1 food from {card}',
        args: { player: cardOwner , card: this},
      })
    }
  },
}
