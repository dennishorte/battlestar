module.exports = {
  id: "cattle-buyer-c167",
  name: "Cattle Buyer",
  deck: "occupationC",
  number: 167,
  type: "occupation",
  players: "4+",
  text: "Each time another player uses the \"Fencing\" action space, you can buy exactly 1 sheep/wild boar/cattle from the general supply for 1/2/2 food.",
  onAnyAction(game, actingPlayer, actionId, cardOwner) {
    if (actionId === 'fencing' && actingPlayer.name !== cardOwner.name) {
      const choices = []
      if (cardOwner.food >= 1) {
        choices.push('Buy 1 sheep for 1 food')
      }
      if (cardOwner.food >= 2) {
        choices.push('Buy 1 wild boar for 2 food')
      }
      if (cardOwner.food >= 2) {
        choices.push('Buy 1 cattle for 2 food')
      }
      choices.push('Skip')

      if (choices.length > 1) {
        const selection = game.actions.choose(cardOwner, () => choices, { title: 'Cattle Buyer', min: 1, max: 1 })
        if (selection[0] === 'Buy 1 sheep for 1 food') {
          cardOwner.payCost({ food: 1 })
          cardOwner.addAnimals('sheep', 1)
          game.log.add({ template: '{player} buys 1 sheep from Cattle Buyer', args: { player: cardOwner } })
        }
        else if (selection[0] === 'Buy 1 wild boar for 2 food') {
          cardOwner.payCost({ food: 2 })
          cardOwner.addAnimals('boar', 1)
          game.log.add({ template: '{player} buys 1 wild boar from Cattle Buyer', args: { player: cardOwner } })
        }
        else if (selection[0] === 'Buy 1 cattle for 2 food') {
          cardOwner.payCost({ food: 2 })
          cardOwner.addAnimals('cattle', 1)
          game.log.add({ template: '{player} buys 1 cattle from Cattle Buyer', args: { player: cardOwner } })
        }
      }
    }
  },
}
