module.exports = {
  id: "joiner-of-the-sea-a159",
  name: "Joiner of the Sea",
  deck: "occupationA",
  number: 159,
  type: "occupation",
  players: "4+",
  text: "Each time another player uses the \"Fishing\"/\"Reed Bank\" accumulation space, you can give them 1 wood to get 2 food/3 food from the general supply.",
  onAnyAction(game, actingPlayer, actionId, cardOwner) {
    if (actionId !== 'fishing' && actionId !== 'take-reed' || actingPlayer.name === cardOwner.name || cardOwner.wood < 1) {
      return
    }
    const cardName = 'Joiner of the Sea'
    const food = actionId === 'fishing' ? 2 : 3
    const choices = [`Give 1 wood to ${actingPlayer.name} to get ${food} food`, 'Skip']
    const selection = game.actions.choose(cardOwner, choices, {
      title: `${cardName}: Give 1 wood to get ${food} food?`,
      min: 1,
      max: 1,
    })
    if (selection[0] === 'Skip') {
      return
    }
    cardOwner.payCost({ wood: 1 })
    actingPlayer.addResource('wood', 1)
    cardOwner.addResource('food', food)
    game.log.add({
      template: '{cardOwner} gives 1 wood to {receiver} and gets {food} food via {card}',
      args: { cardOwner, receiver: actingPlayer.name, food, card: cardName },
    })
  },
}
