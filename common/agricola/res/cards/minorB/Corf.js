module.exports = {
  id: "corf-b079",
  name: "Corf",
  deck: "minorB",
  number: 79,
  type: "minor",
  cost: { reed: 1 },
  category: "Building Resource Provider",
  text: "Each time any player (including you) takes at least 3 stone from an accumulation space, you get 1 stone from the general supply.",
  onAnyAction(game, actingPlayer, actionId, cardOwner, details) {
    if ((actionId === 'take-stone-1' || actionId === 'take-stone-2') && details && details.stoneTaken >= 3) {
      cardOwner.addResource('stone', 1)
      game.log.add({
        template: '{player} gets 1 stone from Corf',
        args: { player: cardOwner },
      })
    }
  },
}
