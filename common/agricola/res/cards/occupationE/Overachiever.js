module.exports = {
  id: "overachiever-e130",
  name: "Overachiever",
  deck: "occupationE",
  number: 130,
  type: "occupation",
  players: "1+",
  text: "Each time you use a \"Wish for Children\" action space, you can play 1 additional improvement by paying its cost less 1 resource of your choice.",
  onAction(game, player, actionId) {
    if (actionId === 'family-growth' || actionId === 'family-growth-urgent') {
      const selection = game.actions.choose(player, ['Build improvement (discounted)', 'Skip'], {
        title: 'Overachiever: Build improvement at -1 resource?',
        min: 1,
        max: 1,
      })
      if (selection[0] !== 'Skip') {
        const built = game.actions.buildImprovement(player)
        if (built) {
          // Refund 1 resource of choice
          const refundChoices = []
          for (const res of ['wood', 'clay', 'reed', 'stone']) {
            if (player[res] !== undefined) {
              refundChoices.push(`Refund 1 ${res}`)
            }
          }
          if (refundChoices.length > 0) {
            const refund = game.actions.choose(player, refundChoices, {
              title: 'Overachiever: Which resource to refund?',
              min: 1,
              max: 1,
            })
            const resource = refund[0].match(/Refund 1 (\w+)/)[1]
            player.addResource(resource, 1)
            game.log.add({
              template: '{player} gets 1 {resource} back from {card}',
              args: { player, resource , card: this},
            })
          }
        }
      }
    }
  },
}
