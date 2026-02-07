module.exports = {
  id: "lutenist-a160",
  name: "Lutenist",
  deck: "occupationA",
  number: 160,
  type: "occupation",
  players: "4+",
  text: "Each time another player uses the \"Traveling Players\" accumulation space, you get 1 food and 1 wood. Immediately after, you can buy exactly 1 vegetable for 2 food.",
  onAnyAction(game, actingPlayer, actionId, cardOwner) {
    if (actionId === 'traveling-players' && actingPlayer.name !== cardOwner.name) {
      cardOwner.addResource('food', 1)
      cardOwner.addResource('wood', 1)
      game.log.add({
        template: '{player} gets 1 food and 1 wood from Lutenist',
        args: { player: cardOwner },
      })
      if (cardOwner.food >= 2 || game.getAnytimeFoodConversionOptions(cardOwner).length > 0) {
        game.actions.offerBuyVegetable(cardOwner, this, 2)
      }
    }
  },
}
