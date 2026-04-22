'use strict'

const constants = require('../../constants.js')
const { addStrength } = require('../../../systems/strengthBreakdown.js')

module.exports = {
  id: "cannon-turrets",
  name: "Cannon Turrets",
  source: "Rise of Ix",
  compatibility: "All",
  count: 1,
  hasTech: true,
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
    // +2 Swords; Each opponent retreats one Dreadnought (expansion)
    addStrength(game, player, 'intrigue', 'Cannon Turrets', 2 * constants.SWORD_STRENGTH)
    game.log.add({ template: '{player}: +2 Swords (Dreadnought retreat is expansion)', args: { player } })
  },

}
