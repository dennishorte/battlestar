module.exports = {
  id: "buyer-a156",
  name: "Buyer",
  deck: "occupationA",
  number: 156,
  type: "occupation",
  players: "4+",
  text: "Each time another player uses a reed, stone, sheep, or wild boar accumulation space, you can pay them 1 food to get 1 good of the respective type from the general supply.",
  onAnyAction(game, actingPlayer, actionId, cardOwner) {
    const typeMap = {
      'take-reed': 'reed',
      'take-stone-1': 'stone',
      'take-stone-2': 'stone',
      'take-sheep': 'sheep',
      'take-boar': 'boar',
    }
    const good = typeMap[actionId]
    if (!good || actingPlayer.name === cardOwner.name || cardOwner.food < 1) {
      return
    }
    const cardName = 'Buyer'
    const label = good === 'boar' ? 'wild boar' : good
    const choices = [`Pay 1 food to ${actingPlayer.name} to get 1 ${label}`, 'Skip']
    const selection = game.actions.choose(cardOwner, choices, {
      title: `${cardName}: Pay 1 food to get 1 ${label}?`,
      min: 1,
      max: 1,
    })
    if (selection[0] === 'Skip') {
      return
    }
    cardOwner.payCost({ food: 1 })
    actingPlayer.addResource('food', 1)
    cardOwner.addResource(good, 1)
    game.log.add({
      template: '{cardOwner} pays 1 food to {receiver} and gets 1 {good} via {card}',
      args: { cardOwner, receiver: actingPlayer.name, good, card: cardName },
    })
  },
}
