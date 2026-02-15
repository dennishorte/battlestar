module.exports = {
  id: "forest-guardian-b138",
  name: "Forest Guardian",
  deck: "occupationB",
  number: 138,
  type: "occupation",
  players: "3+",
  text: "When you play this card, you immediately get 2 wood. Each time before another player takes at least 5 wood from an accumulation space, they must first pay you 1 food.",
  onPlay(game, player) {
    player.addResource('wood', 2)
    game.log.add({
      template: '{player} gets 2 wood from Forest Guardian',
      args: { player },
    })
  },
  onAnyAction(game, actingPlayer, actionId, cardOwner, resources) {
    const woodActions = ['take-wood', 'copse', 'copse-5', 'grove', 'grove-5', 'grove-6']
    if (woodActions.includes(actionId) && actingPlayer.name !== cardOwner.name) {
      const woodTaken = (resources && resources.wood) || 0
      if (woodTaken >= 5 && actingPlayer.food >= 1) {
        actingPlayer.payCost({ food: 1 })
        cardOwner.addResource('food', 1)
        game.log.add({
          template: '{actingPlayer} pays 1 food to {player} for Forest Guardian',
          args: { actingPlayer, player: cardOwner },
        })
      }
    }
  },
}
