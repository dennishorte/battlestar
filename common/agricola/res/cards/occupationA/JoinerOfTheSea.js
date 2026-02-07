module.exports = {
  id: "joiner-of-the-sea-a159",
  name: "Joiner of the Sea",
  deck: "occupationA",
  number: 159,
  type: "occupation",
  players: "4+",
  text: "Each time another player uses the \"Fishing\"/\"Reed Bank\" accumulation space, you can give them 1 wood to get 2 food/3 food from the general supply.",
  onAnyAction(game, actingPlayer, actionId, cardOwner) {
    if ((actionId === 'fishing' || actionId === 'take-reed') && actingPlayer.name !== cardOwner.name && cardOwner.wood >= 1) {
      const food = actionId === 'fishing' ? 2 : 3
      game.actions.offerJoinerOfTheSeaTrade(cardOwner, actingPlayer, this, food)
    }
  },
}
