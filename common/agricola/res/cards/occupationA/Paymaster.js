module.exports = {
  id: "paymaster-a154",
  name: "Paymaster",
  deck: "occupationA",
  number: 154,
  type: "occupation",
  players: "3+",
  text: "Each time another player uses a food accumulation space, you can give them 1 grain from your supply to get 1 bonus point.",
  onAnyAction(game, actingPlayer, actionId, cardOwner) {
    if (game.isFoodAccumulationSpace(actionId) && actingPlayer.name !== cardOwner.name && cardOwner.grain >= 1) {
      game.actions.offerPaymasterBonus(cardOwner, actingPlayer, this)
    }
  },
}
