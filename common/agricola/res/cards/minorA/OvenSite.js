module.exports = {
  id: "oven-site-a027",
  name: "Oven Site",
  deck: "minorA",
  number: 27,
  type: "minor",
  cost: {},
  prereqs: { hasFireplaceAndCookingHearth: true },
  category: "Building Resource Provider",
  text: "When you play this card, you get 2 wood and you can immediately build the \"Clay Oven\" or \"Stone Oven\" major improvement. Either way, it only costs you 1 clay and 1 stone.",
  onPlay(game, player) {
    player.addResource('wood', 2)
    game.log.add({
      template: '{player} gets 2 wood from {card}',
      args: { player , card: this},
    })

    const card = this
    const cost = { clay: 1, stone: 1 }
    const choices = []
    const availableMajors = game.getAvailableMajorImprovements()

    if (availableMajors.includes('clay-oven') && player.canAffordCost(cost)) {
      choices.push('Build Clay Oven')
    }
    if (availableMajors.includes('stone-oven') && player.canAffordCost(cost)) {
      choices.push('Build Stone Oven')
    }
    choices.push('Skip')

    if (choices.length === 1) {
      return
    }

    const selection = game.actions.choose(player, choices, {
      title: `${card.name}: Build an oven for ${cost.clay} clay and ${cost.stone} stone?`,
      min: 1,
      max: 1,
    })

    const ovenOpts = {
      customCost: cost,
      logTemplate: '{player} builds {card} at discount using {source}',
      logArgs: { source: card },
    }
    if (selection[0] === 'Build Clay Oven') {
      game.actions._completeMajorPurchase(player, 'clay-oven', ovenOpts)
    }
    else if (selection[0] === 'Build Stone Oven') {
      game.actions._completeMajorPurchase(player, 'stone-oven', ovenOpts)
    }
  },
}
