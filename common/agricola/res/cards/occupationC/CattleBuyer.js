module.exports = {
  id: "cattle-buyer-c167",
  name: "Cattle Buyer",
  deck: "occupationC",
  number: 167,
  type: "occupation",
  players: "4+",
  text: "Each time another player uses the \"Fencing\" action space, you can buy exactly 1 sheep/wild boar/cattle from the general supply for 1/2/2 food.",
  onAnyAction(game, actingPlayer, actionId, cardOwner) {
    if (actionId === 'fencing' && actingPlayer.name !== cardOwner.name) {
      game.actions.offerCattleBuyerPurchase(cardOwner, this)
    }
  },
}
