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
    if (typeMap[actionId] && actingPlayer.name !== cardOwner.name && cardOwner.food >= 1) {
      game.actions.offerBuyerPurchase(cardOwner, actingPlayer, this, typeMap[actionId])
    }
  },
}
