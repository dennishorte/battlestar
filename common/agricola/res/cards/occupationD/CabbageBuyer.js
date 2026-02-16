module.exports = {
  id: "cabbage-buyer-d161",
  name: "Cabbage Buyer",
  deck: "occupationD",
  number: 161,
  type: "occupation",
  players: "1+",
  text: "Each time any player (including you) renovates and then builds no / 1 minor / 1 major improvement, you can buy 1 vegetable for 3/2/1 food.",
  onAnyRenovate(game, actingPlayer, cardOwner) {
    // The hook doesn't pass improvement info, so use base cost of 2 food
    // (middle ground: minor improvement discount)
    const cost = 2
    if (cardOwner.food >= cost) {
      const choices = [`Buy 1 vegetable for ${cost} food`, 'Skip']
      const selection = game.actions.choose(cardOwner, choices, {
        title: 'Cabbage Buyer',
        min: 1,
        max: 1,
      })
      if (selection[0] !== 'Skip') {
        cardOwner.food -= cost
        cardOwner.addResource('vegetables', 1)
        game.log.add({
          template: '{player} buys 1 vegetable for {cost} food (Cabbage Buyer)',
          args: { player: cardOwner, cost },
        })
      }
    }
  },
}
