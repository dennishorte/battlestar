module.exports = {
  id: "sheep-provider-c141",
  name: "Sheep Provider",
  deck: "occupationC",
  number: 141,
  type: "occupation",
  players: "3+",
  text: "Each time any player (including you) uses the \"Sheep Market\" accumulation space, you get 1 grain.",
  onAnyAction(game, actingPlayer, actionId, cardOwner) {
    if (actionId === 'take-sheep') {
      cardOwner.addResource('grain', 1)
      game.log.add({
        template: '{player} gets 1 grain from {card}',
        args: { player: cardOwner , card: this},
      })
    }
  },
}
