module.exports = {
  id: "lutenist-a160",
  name: "Lutenist",
  deck: "occupationA",
  number: 160,
  type: "occupation",
  players: "4+",
  text: "Each time another player uses the \"Traveling Players\" accumulation space, you get 1 food and 1 wood. Immediately after, you can buy exactly 1 vegetable for 2 food.",
  onAnyAction(game, actingPlayer, actionId, cardOwner) {
    if (actionId !== 'traveling-players' || actingPlayer.name === cardOwner.name) {
      return
    }
    cardOwner.addResource('food', 1)
    cardOwner.addResource('wood', 1)
    game.log.add({
      template: '{player} gets 1 food and 1 wood from Lutenist',
      args: { player: cardOwner },
    })
    const canBuyVegetable = cardOwner.food >= 2
    if (!canBuyVegetable) {
      return
    }
    const choices = ['Buy 1 vegetable for 2 food', 'Skip']
    const selection = game.actions.choose(cardOwner, choices, {
      title: 'Lutenist: Buy 1 vegetable for 2 food?',
      min: 1,
      max: 1,
    })
    if (selection[0] === 'Skip') {
      return
    }
    cardOwner.payCost({ food: 2 })
    cardOwner.addResource('vegetables', 1)
    game.log.add({
      template: '{player} buys 1 vegetable for 2 food via Lutenist',
      args: { player: cardOwner },
    })
  },
}
