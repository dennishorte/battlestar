module.exports = {
  id: "clay-warden-b143",
  name: "Clay Warden",
  deck: "occupationB",
  number: 143,
  type: "occupation",
  players: "3+",
  text: "Each time another player uses the \"Hollow\" accumulation space, you get 1 clay. In a 3-/4-player game, you also get 1 clay/food.",
  onAnyAction(game, actingPlayer, actionId, cardOwner) {
    const hollowIds = ['hollow', 'hollow-5', 'hollow-6']
    if (hollowIds.includes(actionId) && actingPlayer.name !== cardOwner.name) {
      cardOwner.addResource('clay', 1)
      const playerCount = game.players.all().length
      if (playerCount === 3) {
        cardOwner.addResource('clay', 1)
        game.log.add({
          template: '{player} gets 2 clay from {card}',
          args: { player: cardOwner , card: this},
        })
      }
      else if (playerCount === 4) {
        cardOwner.addResource('food', 1)
        game.log.add({
          template: '{player} gets 1 clay and 1 food from {card}',
          args: { player: cardOwner , card: this},
        })
      }
      else {
        game.log.add({
          template: '{player} gets 1 clay from {card}',
          args: { player: cardOwner , card: this},
        })
      }
    }
  },
}
