'use strict'

const deckEngine = require('../../../systems/deckEngine.js')
const spies = require('../../../systems/spies.js')
module.exports = {
  id: "insider-information",
  name: "Insider Information",
  source: "Bloodlines",
  compatibility: "All",
  count: 1,
  hasTech: false,
  hasShipping: false,
  hasResearch: false,
  hasSpies: true,
  hasSandworms: false,
  hasContracts: false,
  hasBattleIcons: false,
  hasSardaukar: false,
  isTwisted: false,
  vpsAvailable: 0,
  combatEffect: null,
  endgameEffect: null,
  plotText: "Recall a Spy → Trash a card and Draw a card OR Ignore Influence requirements on board spaces when sending an Agent this turn",

  plotEffect(game, player, card, { resolveEffect }) {
    const observationPosts = require('../../observationPosts.js')
    const hasSpy = observationPosts.some(p => (game.state.spyPosts[p.id] || []).includes(player.name))
    const choices = []
    if (hasSpy) {
      choices.push(game.actions.option({ id: 'recall', title: 'Recall Spy: Trash a card and Draw a card' }))
    }
    choices.push(game.actions.option({ id: 'ignore', title: 'Ignore Influence requirements this turn' }))
    choices.push(game.actions.option({ id: 'pass', title: 'Pass' }))
    const [choice] = game.actions.choose(player, choices, { title: 'Insider Information' })
    const chId = typeof choice === 'object' ? choice.id : choice
    const isRecall = chId === 'recall' || (typeof choice === 'string' && choice.includes('Recall'))
    const isIgnore = chId === 'ignore' || (typeof choice === 'string' && choice.includes('Ignore'))
    if (isRecall) {
      spies.recallSpy(game, player)
      resolveEffect(game, player, { type: 'trash-card' }, null, card.name)
      deckEngine.drawCards(game, player, 1)
    }
    else if (isIgnore) {
      if (game.state.turnTracking) {
        game.state.turnTracking.ignoreInfluenceRequirements = true
      }
    }
  },

}
