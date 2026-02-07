module.exports = {
  id: "resource-recycler-c149",
  name: "Resource Recycler",
  deck: "occupationC",
  number: 149,
  type: "occupation",
  players: "3+",
  text: "Each time another player renovates to stone, if you live in a clay house, you can pay 2 food to build a clay room at no additional cost.",
  onAnyRenovate(game, actingPlayer, cardOwner, toType) {
    if (toType === 'stone' && actingPlayer.name !== cardOwner.name && cardOwner.roomType === 'clay' && cardOwner.food >= 2) {
      game.actions.offerResourceRecyclerRoom(cardOwner, this)
    }
  },
}
