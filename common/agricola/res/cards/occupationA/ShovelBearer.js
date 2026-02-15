module.exports = {
  id: "shovel-bearer-a140",
  name: "Shovel Bearer",
  deck: "occupationA",
  number: 140,
  type: "occupation",
  players: "3+",
  text: "Each time you use the \"Clay Pit\" or \"Hollow\" accumulation space, you also get a number of food equal to the amount of clay on the respective other accumulation space.",
  onAction(game, player, actionId) {
    let otherSpace = null
    if (actionId === 'take-clay') {
      // Other clay space is Hollow (id varies by player count: hollow, hollow-5, hollow-6)
      otherSpace = game.state.actionSpaces['hollow'] ? 'hollow' : game.state.actionSpaces['hollow-5'] ? 'hollow-5' : 'hollow-6'
    }
    else if (actionId === 'hollow' || actionId === 'hollow-5' || actionId === 'hollow-6') {
      otherSpace = 'take-clay'
    }
    if (otherSpace) {
      const clayOnOther = game.getAccumulatedResources(otherSpace).clay || 0
      if (clayOnOther > 0) {
        player.addResource('food', clayOnOther)
        game.log.add({
          template: '{player} gets {amount} food from Shovel Bearer',
          args: { player, amount: clayOnOther },
        })
      }
    }
  },
}
