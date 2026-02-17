module.exports = {
  id: "hollow-warden-a139",
  name: "Hollow Warden",
  deck: "occupationA",
  number: 139,
  type: "occupation",
  players: "3+",
  text: "When you play this card, you immediately get a \"Major Improvement\" action to build a Fireplace. Each time you use the \"Hollow\" accumulation space, you also get 1 food.",
  onPlay(game, player) {
    const card = this
    const fireplaceIds = ['fireplace-2', 'fireplace-3']
    const available = game.getAvailableMajorImprovements()
      .filter(id => fireplaceIds.includes(id))
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
      title: 'Hollow Warden: Build a Fireplace?',
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
  },
  onAction(game, player, actionId) {
    if (actionId === 'hollow' || actionId === 'hollow-5' || actionId === 'hollow-6') {
      player.addResource('food', 1)
      game.log.add({
        template: '{player} gets 1 food from Hollow Warden',
        args: { player },
      })
    }
  },
}
