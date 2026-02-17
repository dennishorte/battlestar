module.exports = {
  id: "paymaster-a154",
  name: "Paymaster",
  deck: "occupationA",
  number: 154,
  type: "occupation",
  players: "3+",
  text: "Each time another player uses a food accumulation space, you can give them 1 grain from your supply to get 1 bonus point.",
  onAnyAction(game, actingPlayer, actionId, cardOwner) {
    const foodSpaces = ['fishing', 'traveling-players', 'traveling-players-5']
    if (!foodSpaces.includes(actionId) || actingPlayer.name === cardOwner.name || cardOwner.grain < 1) {
      return
    }
    const cardName = 'Paymaster'
    const choices = [`Give 1 grain to ${actingPlayer.name} for 1 bonus point`, 'Skip']
    const selection = game.actions.choose(cardOwner, choices, {
      title: `${cardName}: Give grain for bonus point?`,
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
      args: { cardOwner, receiver: actingPlayer.name, card: cardName },
    })
  },
}
