'use strict'

const constants = require('../../constants.js')
const { addStrength } = require('../../../systems/strengthBreakdown.js')

module.exports = {
  id: "strategic-push",
  name: "Strategic Push",
  source: "Rise of Ix",
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
  combatText: "+2 Swords; If you win this Conflict: +2 Solari",

  combatEffect(game, player) {
    addStrength(game, player, 'intrigue', 'Strategic Push', 2 * constants.SWORD_STRENGTH)
    if (game.state.turnTracking) {
      game.state.turnTracking.strategicPush = true
    }
    game.log.add({ template: '{player}: +2 Swords (if win: +2 Solari)', args: { player } })
  },

}
