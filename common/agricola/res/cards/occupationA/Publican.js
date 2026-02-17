module.exports = {
  id: "publican-a132",
  name: "Publican",
  deck: "occupationA",
  number: 132,
  type: "occupation",
  players: "1+",
  text: "Each time before another player takes an unconditional \"Sow\" action, you can give them 1 grain from your supply to get 1 bonus point.",
  onAnyBeforeSow(game, actingPlayer, cardOwner) {
    if (actingPlayer.name !== cardOwner.name && cardOwner.grain >= 1) {
      const card = this
      const choices = [
        `Give 1 grain to ${actingPlayer.name} for 1 bonus point`,
        'Skip',
      ]
      const selection = game.actions.choose(cardOwner, choices, {
        title: `${card.name}: Give grain for bonus point?`,
        min: 1,
        max: 1,
      })
      if (selection[0] === 'Skip') {
        return
      }
      cardOwner.payCost({ grain: 1 })
      actingPlayer.addResource('grain', 1)
      cardOwner.addBonusPoints(1)
      game.log.add({
        template: '{cardOwner} gives 1 grain to {receiver} for 1 bonus point via {card}',
        args: { cardOwner, receiver: actingPlayer.name, card },
      })
    }
  },
}
