function offerToolboxMajor(game, player, card) {
  const toolboxMajors = ['joinery', 'pottery', 'basketmakers-workshop']
  const available = game.getAvailableMajorImprovements()
    .filter(id => toolboxMajors.includes(id))
    .filter(id => player.canBuyMajorImprovement(id))

  if (available.length === 0) {
    return
  }

  const choices = available.map(id => {
    const imp = game.cards.byId(id)
    return imp.name + ` (${id})`
  })
  choices.push('Do not build')

  const selection = game.actions.choose(player, choices, {
    title: 'Toolbox: Build a major improvement?',
    min: 1,
    max: 1,
  })

  const sel = Array.isArray(selection) ? selection[0] : selection
  if (sel === 'Do not build') {
    return
  }

  const idMatch = sel.match(/\(([^)]+)\)/)
  const improvementId = idMatch ? idMatch[1] : null

  if (improvementId) {
    game.actions._completeMajorPurchase(player, improvementId, {
      logTemplate: '{player} uses {source} to build {card}',
      logArgs: { source: card },
    })
  }
}

module.exports = {
  id: "toolbox-b027",
  name: "Toolbox",
  deck: "minorB",
  number: 27,
  type: "minor",
  cost: { wood: 1 },
  category: "Actions Booster",
  text: "In the work phase, after each turn in which you build at least 1 room, stable or fence, you can build the \"Joinery\", \"Pottery\", or \"Basketmaker's Workshop\" major improvement.",
  onBuildRoom(game, player) {
    offerToolboxMajor(game, player, this)
  },
  onBuildStable(game, player) {
    offerToolboxMajor(game, player, this)
  },
  onBuildFences(game, player) {
    offerToolboxMajor(game, player, this)
  },
}
