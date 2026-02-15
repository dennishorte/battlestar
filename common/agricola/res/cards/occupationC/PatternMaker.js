module.exports = {
  id: "pattern-maker-c153",
  name: "Pattern Maker",
  deck: "occupationC",
  number: 153,
  type: "occupation",
  players: "3+",
  text: "Each time another player renovates, you can exchange exactly 2 wood for 1 grain, 1 food, and 1 bonus point.",
  // Note: onAnyRenovate hook is not fired by engine (only onAnyRenovateToStone).
  // This card's renovation trigger cannot fire in the current implementation.
  onAnyRenovate(game, actingPlayer, cardOwner) {
    if (actingPlayer.name !== cardOwner.name && cardOwner.wood >= 2) {
      const selection = game.actions.choose(cardOwner, () => [
        'Exchange 2 wood for 1 grain, 1 food, 1 BP',
        'Skip',
      ], { title: 'Pattern Maker', min: 1, max: 1 })
      if (selection[0] !== 'Skip') {
        cardOwner.payCost({ wood: 2 })
        cardOwner.addResource('grain', 1)
        cardOwner.addResource('food', 1)
        cardOwner.bonusPoints = (cardOwner.bonusPoints || 0) + 1
        game.log.add({
          template: '{player} exchanges 2 wood for 1 grain, 1 food, and 1 BP from Pattern Maker',
          args: { player: cardOwner },
        })
      }
    }
  },
}
