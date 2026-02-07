module.exports = {
  id: "kelp-gatherer-e160",
  name: "Kelp Gatherer",
  deck: "occupationE",
  number: 160,
  type: "occupation",
  players: "1+",
  text: "Each time another player uses the \"Fishing\" accumulation space, they get 1 additional food and you get 1 vegetable.",
  onAnyAction(game, actingPlayer, actionId, cardOwner) {
    if (actionId === 'fishing' && actingPlayer.name !== cardOwner.name) {
      actingPlayer.addResource('food', 1)
      cardOwner.addResource('vegetables', 1)
      game.log.add({
        template: '{player} gets 1 vegetable from Kelp Gatherer, {other} gets 1 extra food',
        args: { player: cardOwner, other: actingPlayer },
      })
    }
  },
}
