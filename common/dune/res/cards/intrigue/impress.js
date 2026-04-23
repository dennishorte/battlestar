'use strict'

const constants = require('../../constants.js')
const { addStrength } = require('../../../systems/strengthBreakdown.js')

module.exports = {
  id: "impress",
  name: "Impress",
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
  combatText: "+2 Swords and Acquire a card that costs 3 Persuasion or less",

  combatEffect(game, player) {
    addStrength(game, player, 'intrigue', 'Impress', 2 * constants.SWORD_STRENGTH)
    // Acquire a card costing 3 or less — modifier
    player.incrementCounter('persuasion', 3, { silent: true })
    game.log.add({ template: '{player}: +2 Swords, +3 Persuasion for acquire', args: { player } })
  },

}
