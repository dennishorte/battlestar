module.exports = {
  id: "cordmaker-a142",
  name: "Cordmaker",
  deck: "occupationA",
  number: 142,
  type: "occupation",
  players: "3+",
  text: "Each time any player (including you) takes at least 2 reed from the \"Reed Bank\" accumulation space, you can choose to take 1 grain or buy 1 vegetable for 2 food.",
  onAnyAction(game, actingPlayer, actionId, cardOwner, resources) {
    if (actionId === 'take-reed' && resources && resources.reed >= 2) {
      const player = cardOwner
      const card = this
      const choices = ['Take 1 grain']
      if (player.food >= 2) {
        choices.push('Buy 1 vegetable for 2 food')
      }
      choices.push('Skip')

      const selection = game.actions.choose(player, choices, {
        title: `${card.name}: Take 1 grain or buy 1 vegetable for 2 food?`,
        min: 1,
        max: 1,
      })

      if (selection[0] === 'Take 1 grain') {
        player.addResource('grain', 1)
        game.log.add({
          template: '{player} takes 1 grain via {card}',
          args: { player, card },
        })
      }
      else if (selection[0] === 'Buy 1 vegetable for 2 food') {
        player.payCost({ food: 2 })
        player.addResource('vegetables', 1)
        game.log.add({
          template: '{player} buys 1 vegetable for 2 food via {card}',
          args: { player, card },
        })
      }
    }
  },
}
