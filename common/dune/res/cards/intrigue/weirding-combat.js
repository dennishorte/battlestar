'use strict'

const constants = require('../../constants.js')
const { addStrength } = require('../../../systems/strengthBreakdown.js')

module.exports = {
  id: "weirding-combat",
  name: "Weirding Combat",
  source: "Uprising",
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
  combatText: "+3 Swords; if 3 Influence with Bene Gesserit, +2 Swords",

  combatEffect(game, player) {
    let swords = 3
    if (player.getInfluence('bene-gesserit') >= 3) {
      swords += 2
    }
    addStrength(game, player, 'intrigue', 'Weirding Combat', swords * constants.SWORD_STRENGTH)
    game.log.add({ template: '{player}: +{count} Swords', args: { player, count: swords } })
  },

}
