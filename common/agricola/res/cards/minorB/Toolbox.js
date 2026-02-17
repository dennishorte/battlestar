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
    const imp = game.cards.byId(improvementId)
    const result = player.buyMajorImprovement(improvementId)
    game.actions._recordCardPlayed(player, imp)

    game.log.add({
      template: '{player} uses {card} to build {improvement}',
      args: { player, card, improvement: imp.name },
    })

    if (!result.upgraded) {
      player.payCost(player.getMajorImprovementCost(improvementId))
    }

    if (imp.hasHook('onBuy')) {
      imp.callHook('onBuy', game, player)
    }

    game.callPlayerCardHook(player, 'onBuildImprovement', player.getMajorImprovementCost(improvementId), imp)
    game.actions.callOnAnyBuildImprovementHooks(player, player.getMajorImprovementCost(improvementId), imp)
    game.callPlayerCardHook(player, 'onBuildMajor', improvementId)
    game.actions.callOnAnyBuildMajorHooks(player, improvementId)

    game.log.add({
      template: '{player} uses {card} to build {improvement}',
      args: { player, card, improvement: imp },
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
