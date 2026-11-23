'use strict'

const constants = require('../../constants.js')
const { addStrength } = require('../../../systems/strengthBreakdown.js')

module.exports = {
  id: "second-wave",
  name: "Second Wave",
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
  combatText: "+2 Swords, Deploy up to two units from your garrison to the Conflict",

  combatEffect(game, player) {
    addStrength(game, player, 'intrigue', 'Second Wave', 2 * constants.SWORD_STRENGTH)
    const dreadnoughts = require('../../../systems/dreadnoughts.js')
    const options = dreadnoughts.listGarrisonChoices(game, player, 2)
    const usable = options.filter(option => option.troops > 0 || option.ships > 0)
    if (usable.length === 0) {
      return
    }
    const picked = dreadnoughts.chooseDeployment(game, player, options, {
      title: 'Deploy to Conflict?',
    })
    if (picked && (picked.troops > 0 || picked.ships > 0)) {
      dreadnoughts.deploySelected(game, player, picked.troops, picked.ships)
    }
  },

}
