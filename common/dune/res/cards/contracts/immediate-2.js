'use strict'

const deckEngine = require('../../../systems/deckEngine.js')

module.exports = {
  id: 'immediate-2',
  name: 'Immediate',
  trigger: { type: 'immediate' },
  source: 'Bloodlines',
  compatibility: 'Uprising',
  count: 1,
  reward: 'Trash 1 Intrigue card →\n· +1 Intrigue card\n· Draw a card\n(requires an Intrigue card)',
  riseOfIxSpecific: false,

  rewardEffect(game, player, card, { resolveEffect }) {
    const intrigueZone = game.zones.byId(`${player.name}.intrigue`)
    const intrigueCards = intrigueZone.cardlist()
    if (intrigueCards.length === 0) {
      return
    }

    const choices = [
      game.actions.option({ id: 'pass', title: 'Pass' }),
      ...intrigueCards.map(c => game.actions.cardOption(c, 'intrigue-card')),
    ]
    const [choice] = game.actions.choose(player, choices, {
      title: 'Trash an Intrigue card for +1 Intrigue and draw a card?',
    })
    const choiceId = typeof choice === 'object' ? choice.id : choice
    if (choiceId === 'pass' || choice === 'Pass') {
      return
    }

    const chosen = typeof choice === 'object'
      ? intrigueCards.find(c => c.id === choice.id)
      : intrigueCards.find(c => c.name === choice)
    if (!chosen) {
      return
    }

    deckEngine.trashCard(game, chosen, player)
    deckEngine.drawIntrigueCard(game, player, 1)
    resolveEffect(game, player, { type: 'draw', amount: 1 }, null)
  },
}
