module.exports = {
  id: "midwife-d160",
  name: "Midwife",
  deck: "occupationD",
  number: 160,
  type: "occupation",
  players: "1+",
  text: "Each time another player uses the first person they place in a round to take a \"Family Growth\" action, you get 1 grain from the general supply.",
  onAnyAction(game, actingPlayer, actionId, cardOwner) {
    if ((actionId === 'family-growth' || actionId === 'family-growth-urgent') &&
          actingPlayer.name !== cardOwner.name &&
          actingPlayer.getPersonPlacedThisRound() === 1) {
      cardOwner.addResource('grain', 1)
      game.log.add({
        template: '{player} gets 1 grain from Midwife',
        args: { player: cardOwner },
      })
    }
  },
}
