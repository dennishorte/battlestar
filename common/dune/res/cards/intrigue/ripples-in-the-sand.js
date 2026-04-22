'use strict'

const deckEngine = require('../../../systems/deckEngine.js')
const constants = require('../../constants.js')
const { addStrength } = require('../../../systems/strengthBreakdown.js')

module.exports = {
  id: "ripples-in-the-sand",
  name: "Ripples in the Sand",
  source: "Bloodlines",
  compatibility: "All",
  count: 1,
  hasTech: false,
  hasShipping: false,
  hasResearch: false,
  hasSpies: false,
  hasSandworms: true,
  hasContracts: false,
  hasBattleIcons: false,
  hasSardaukar: false,
  isTwisted: false,
  vpsAvailable: 0,
  plotEffect: null,
  endgameEffect: null,

  combatEffect(game, player) {
    addStrength(game, player, 'intrigue', 'Ripples in the Sand', 3 * constants.SWORD_STRENGTH)
    const sandworms = game.state.conflict.deployedSandworms[player.name] || 0
    if (sandworms > 0) {
      deckEngine.drawIntrigueCard(game, player, 1)
      game.log.add({ template: '{player}: +3 Swords, +1 Intrigue (Sandworm)', args: { player } })
    }
    else {
      game.log.add({ template: '{player}: +3 Swords', args: { player } })
    }
  },

}
