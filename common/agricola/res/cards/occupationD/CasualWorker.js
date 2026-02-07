module.exports = {
  id: "casual-worker-d149",
  name: "Casual Worker",
  deck: "occupationD",
  number: 149,
  type: "occupation",
  players: "1+",
  text: "Each time another player uses a \"Quarry\" accumulation space, you can choose to get 1 food or build a stable without paying wood.",
  onAnyAction(game, actingPlayer, actionId, cardOwner) {
    if ((actionId === 'take-stone-1' || actionId === 'take-stone-2') && actingPlayer.name !== cardOwner.name) {
      game.actions.offerCasualWorkerChoice(cardOwner, this)
    }
  },
}
