module.exports = {
  id: "cabbage-buyer-d161",
  name: "Cabbage Buyer",
  deck: "occupationD",
  number: 161,
  type: "occupation",
  players: "1+",
  text: "Each time any player (including you) renovates and then builds no / 1 minor / 1 major improvement, you can buy 1 vegetable for 3/2/1 food.",
  onAnyRenovate(game, actingPlayer, cardOwner, improvementBuilt) {
    let cost = 3
    if (improvementBuilt === 'major') {
      cost = 1
    }
    else if (improvementBuilt === 'minor') {
      cost = 2
    }
    if (cardOwner.food >= cost) {
      game.actions.offerBuyVegetable(cardOwner, this, cost)
    }
  },
}
