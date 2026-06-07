module.exports = {
  id: "casual-worker-d149",
  name: "Casual Worker",
  deck: "occupationD",
  number: 149,
  type: "occupation",
  players: "4+",
  text: "Each time another player uses a \"Quarry\" accumulation space, you can choose to get 1 food or build a stable without paying wood.",
  onAnyAction(game, actingPlayer, actionId, cardOwner) {
    if (actingPlayer.name === cardOwner.name) {
      return
    }
    if (actionId !== 'take-stone-1' && actionId !== 'take-stone-2') {
      return
    }
    const choices = [
      game.actions.option({ id: 'food', title: 'Get 1 food' }),
      game.actions.option({ id: 'stable', title: 'Build free stable' }),
      game.actions.option({ id: 'skip', title: 'Skip' }),
    ]
    const selection = game.actions.choose(cardOwner, choices, {
      title: 'Casual Worker',
      min: 1,
      max: 1,
    })
    if (selection[0].id === 'food') {
      cardOwner.addResource('food', 1)
      game.log.add({
        template: '{player} gets 1 food from {card}',
        args: { player: cardOwner , card: this},
      })
    }
    else if (selection[0].id === 'stable') {
      game.actions.buildFreeStable(cardOwner, this)
    }
  },
}
