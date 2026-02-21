module.exports = {
  id: "forest-trader-d125",
  name: "Forest Trader",
  deck: "occupationD",
  number: 125,
  type: "occupation",
  players: "1+",
  text: "Each time you use a wood or clay accumulation space, you can also buy exactly 1 building resource. Wood, clay, and reed cost 1 food each; stone costs 2 food.",
  onAction(game, player, actionId) {
    const woodClaySpaces = ['take-wood', 'grove', 'grove-5', 'grove-6', 'copse', 'copse-5', 'take-clay', 'hollow', 'hollow-5', 'hollow-6']
    if (!woodClaySpaces.includes(actionId)) {
      return
    }
    if (player.food < 1) {
      return
    }
    const choices = []
    if (player.food >= 1) {
      choices.push('Buy 1 wood for 1 food')
      choices.push('Buy 1 clay for 1 food')
      choices.push('Buy 1 reed for 1 food')
    }
    if (player.food >= 2) {
      choices.push('Buy 1 stone for 2 food')
    }
    choices.push('Skip')
    const selection = game.actions.choose(player, choices, {
      title: 'Forest Trader',
      min: 1,
      max: 1,
    })
    if (selection[0] === 'Skip') {
      return
    }
    if (selection[0] === 'Buy 1 stone for 2 food') {
      player.removeResource('food', 2)
      player.addResource('stone', 1)
      game.log.add({
        template: '{player} buys 1 stone for 2 food ({card})',
        args: { player , card: this},
      })
    }
    else {
      const resource = selection[0].match(/Buy 1 (\w+)/)[1]
      player.removeResource('food', 1)
      player.addResource(resource, 1)
      game.log.add({
        template: '{player} buys 1 {resource} for 1 food ({card})',
        args: { player, resource , card: this},
      })
    }
  },
}
