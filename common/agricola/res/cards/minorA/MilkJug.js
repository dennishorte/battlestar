module.exports = {
  id: "milk-jug-a050",
  name: "Milk Jug",
  deck: "minorA",
  number: 50,
  type: "minor",
  cost: { clay: 1 },
  category: "Food Provider",
  text: "Each time any player (including you) uses the \"Cattle Market\" accumulation space, you get 3 food, and each other player gets 1 food.",
  onAnyAction(game, actingPlayer, actionId, cardOwner) {
    if (actionId === 'take-cattle') {
      cardOwner.addResource('food', 3)
      game.log.add({
        template: '{player} gets 3 food from Milk Jug',
        args: { player: cardOwner },
      })
      for (const player of game.players.all()) {
        if (player.name !== cardOwner.name) {
          player.addResource('food', 1)
          game.log.add({
            template: '{player} gets 1 food from Milk Jug',
            args: { player },
          })
        }
      }
    }
  },
}
