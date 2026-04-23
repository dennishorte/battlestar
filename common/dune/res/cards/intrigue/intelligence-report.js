'use strict'

const deckEngine = require('../../../systems/deckEngine.js')
module.exports = {
  id: "intelligence-report",
  name: "Intelligence Report",
  source: "Uprising",
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
    deckEngine.drawCards(game, player, 1)
    // Check spy count on board
    const observationPosts = require('../../observationPosts.js')
    let spyCount = 0
    for (const post of observationPosts) {
      const occupants = game.state.spyPosts[post.id] || []
      if (occupants.includes(player.name)) {
        spyCount++
      }
    }
    if (spyCount >= 2) {
      deckEngine.drawCards(game, player, 1)
      game.log.add({ template: '{player}: 2+ Spies — draws another card', args: { player } })
    }
  },

}
