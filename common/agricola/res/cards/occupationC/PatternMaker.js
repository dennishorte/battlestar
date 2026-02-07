module.exports = {
  id: "pattern-maker-c153",
  name: "Pattern Maker",
  deck: "occupationC",
  number: 153,
  type: "occupation",
  players: "3+",
  text: "Each time another player renovates, you can exchange exactly 2 wood for 1 grain, 1 food, and 1 bonus point.",
  onAnyRenovate(game, actingPlayer, cardOwner) {
    if (actingPlayer.name !== cardOwner.name && cardOwner.wood >= 2) {
      game.actions.offerPatternMakerExchange(cardOwner, this)
    }
  },
}
