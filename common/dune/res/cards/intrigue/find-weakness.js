'use strict'

const spies = require('../../../systems/spies.js')
const constants = require('../../constants.js')
const { addStrength } = require('../../../systems/strengthBreakdown.js')

module.exports = {
  id: "find-weakness",
  name: "Find Weakness",
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
  plotEffect: null,
  endgameEffect: null,

  combatEffect(game, player) {
    addStrength(game, player, 'intrigue', 'Find Weakness', 2 * constants.SWORD_STRENGTH)
    const observationPosts = require('../res/observationPosts.js')
    const hasSpy = observationPosts.some(p => (game.state.spyPosts[p.id] || []).includes(player.name))
    if (hasSpy) {
      spies.recallSpy(game, player)
      addStrength(game, player, 'intrigue', 'Find Weakness (Spy)', 3 * constants.SWORD_STRENGTH)
      game.log.add({ template: '{player}: +5 Swords (recalled Spy)', args: { player } })
    }
    else {
      game.log.add({ template: '{player}: +2 Swords', args: { player } })
    }
  },

}
