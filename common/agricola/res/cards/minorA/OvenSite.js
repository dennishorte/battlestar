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
      template: '{player} gets 2 wood from Oven Site',
      args: { player },
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

    if (selection[0] === 'Build Clay Oven') {
      player.payCost(cost)
      const imp = game.cards.byId('clay-oven')
      imp.moveTo(game.zones.byPlayer(player, 'majorImprovements'))
      game.log.add({
        template: '{player} builds Clay Oven at discount using {card}',
        args: { player, card },
      })
    }
    else if (selection[0] === 'Build Stone Oven') {
      player.payCost(cost)
      const imp = game.cards.byId('stone-oven')
      imp.moveTo(game.zones.byPlayer(player, 'majorImprovements'))
      game.log.add({
        template: '{player} builds Stone Oven at discount using {card}',
        args: { player, card },
      })
    }
  },
}
