module.exports = {
  id: "culinary-artist-a158",
  name: "Culinary Artist",
  deck: "occupationA",
  number: 158,
  type: "occupation",
  players: "4+",
  text: "Each time another player uses the \"Traveling Players\" accumulation space, you can exchange your choice of 1 grain/sheep/vegetable for 4/5/7 food.",
  onAnyAction(game, actingPlayer, actionId, cardOwner) {
    if (actionId !== 'traveling-players' || actingPlayer.name === cardOwner.name) {
      return
    }
    const options = []
    if (cardOwner.grain >= 1) {
      options.push('Exchange 1 grain for 4 food')
    }
    if (cardOwner.getTotalAnimals('sheep') >= 1) {
      options.push('Exchange 1 sheep for 5 food')
    }
    if (cardOwner.vegetables >= 1) {
      options.push('Exchange 1 vegetable for 7 food')
    }
    if (options.length === 0) {
      return
    }
    options.push('Skip')
    const selection = game.actions.choose(cardOwner, options, {
      title: 'Culinary Artist: Exchange for food?',
      min: 1,
      max: 1,
    })
    const choice = selection[0]
    if (choice === 'Skip') {
      return
    }
    if (choice === 'Exchange 1 grain for 4 food') {
      cardOwner.payCost({ grain: 1 })
      cardOwner.addResource('food', 4)
    }
    else if (choice === 'Exchange 1 sheep for 5 food') {
      cardOwner.removeAnimals('sheep', 1)
      cardOwner.addResource('food', 5)
    }
    else if (choice === 'Exchange 1 vegetable for 7 food') {
      cardOwner.payCost({ vegetables: 1 })
      cardOwner.addResource('food', 7)
    }
    game.log.add({
      template: '{player} exchanges via {card} for food',
      args: { player: cardOwner , card: this},
    })
  },
}
