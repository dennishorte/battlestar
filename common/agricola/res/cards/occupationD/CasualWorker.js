module.exports = {
  id: "casual-worker-d149",
  name: "Casual Worker",
  deck: "occupationD",
  number: 149,
  type: "occupation",
  players: "1+",
  text: "Each time another player uses a \"Quarry\" accumulation space, you can choose to get 1 food or build a stable without paying wood.",
  onAnyAction(game, actingPlayer, actionId, cardOwner) {
    if (actingPlayer.name === cardOwner.name) {
      return
    }
    if (actionId !== 'take-stone-1' && actionId !== 'take-stone-2') {
      return
    }
    const choices = ['Get 1 food', 'Build free stable', 'Skip']
    const selection = game.actions.choose(cardOwner, choices, {
      title: 'Casual Worker',
      min: 1,
      max: 1,
    })
    if (selection[0] === 'Get 1 food') {
      cardOwner.addResource('food', 1)
      game.log.add({
        template: '{player} gets 1 food from {card}',
        args: { player: cardOwner , card: this},
      })
    }
    else if (selection[0] === 'Build free stable') {
      game.actions.buildFreeStable(cardOwner, this)
    }
  },
}
