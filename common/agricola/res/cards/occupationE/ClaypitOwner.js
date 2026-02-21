module.exports = {
  id: "claypit-owner-e156",
  name: "Claypit Owner",
  deck: "occupationE",
  number: 156,
  type: "occupation",
  players: "1+",
  text: "Each time another player plays or builds an improvement with a printed clay cost, you get 1 food and 1 clay.",
  onAnyPlayImprovement(game, actingPlayer, cardOwner, improvement) {
    if (actingPlayer.name !== cardOwner.name && improvement.cost && improvement.cost.clay) {
      cardOwner.addResource('food', 1)
      cardOwner.addResource('clay', 1)
      game.log.add({
        template: '{player} gets 1 food and 1 clay from {card}',
        args: { player: cardOwner , card: this},
      })
    }
  },
}
