module.exports = {
  id: "puppeteer-c152",
  name: "Puppeteer",
  deck: "occupationC",
  number: 152,
  type: "occupation",
  players: "3+",
  text: "Each time another player uses the \"Traveling Players\" accumulation space, you can pay them 1 food to immediately play an occupation without paying an occupation cost.",
  onAnyAction(game, actingPlayer, actionId, cardOwner) {
    if (actionId === 'traveling-players' && actingPlayer.name !== cardOwner.name && cardOwner.food >= 1) {
      const selection = game.actions.choose(cardOwner, () => [
        'Pay 1 food to play an occupation (free)',
        'Skip',
      ], { title: 'Puppeteer', min: 1, max: 1 })
      if (selection[0] !== 'Skip') {
        cardOwner.payCost({ food: 1 })
        actingPlayer.addResource('food', 1)
        game.actions.offerPlayOccupation(cardOwner, this, { cost: {} })
      }
    }
  },
}
