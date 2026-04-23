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

  plotEffect(game, player) {
    // Recall Spy -> Trash + Draw OR Ignore Influence requirements
    const observationPosts = require('../../observationPosts.js')
    const hasSpy = observationPosts.some(p => (game.state.spyPosts[p.id] || []).includes(player.name))
    const choices = []
    if (hasSpy) {
      choices.push('Recall Spy: Trash a card and Draw a card')
    }
    choices.push('Ignore Influence requirements this turn')
    choices.push('Pass')
    const [choice] = game.actions.choose(player, choices, { title: 'Insider Information' })
    if (choice.includes('Recall')) {
      spies.recallSpy(game, player)
      // Trash from hand
      const handZone = game.zones.byId(`${player.name}.hand`)
      const cards = handZone.cardlist()
      if (cards.length > 0) {
        const [tc] = game.actions.choose(player, cards.map(c => c.name), { title: 'Trash a card' })
        const card = cards.find(c => c.name === tc)
        if (card) {
          deckEngine.trashCard(game, card)
        }
      }
      deckEngine.drawCards(game, player, 1)
    }
    else if (choice.includes('Ignore')) {
      if (game.state.turnTracking) {
        game.state.turnTracking.ignoreInfluenceRequirements = true
      }
    }
  },

}
