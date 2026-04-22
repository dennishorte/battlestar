'use strict'

const constants = require('../../constants.js')
const { addStrength } = require('../../../systems/strengthBreakdown.js')

module.exports = {
  id: "return-the-favor",
  name: "Return the Favor",
  source: "Bloodlines",
  compatibility: "All",
  count: 1,
  hasTech: false,
  hasShipping: false,
  hasResearch: false,
  hasSpies: false,
  hasSandworms: false,
  hasContracts: false,
  hasBattleIcons: false,
  hasSardaukar: false,
  isTwisted: false,
  vpsAvailable: 0,
  plotEffect: null,
  endgameEffect: null,

  combatEffect(game, player) {
    let swords = 1
    for (const faction of constants.FACTIONS) {
      if (player.getInfluence(faction) >= 2) {
        swords++
      }
    }
    addStrength(game, player, 'intrigue', 'Return the Favor', swords * constants.SWORD_STRENGTH)
    game.log.add({ template: '{player}: +{count} Swords', args: { player, count: swords } })
  },

}
