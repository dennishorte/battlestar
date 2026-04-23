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
    const max = Math.min(2, player.troopsInGarrison)
    if (max > 0) {
      const choices = []
      for (let i = 0; i <= max; i++) {
        choices.push(`Deploy ${i}`)
      }
      const [choice] = game.actions.choose(player, choices, { title: 'Deploy to Conflict?' })
      const count = parseInt(choice.match(/\d+/)[0])
      if (count > 0) {
        player.decrementCounter('troopsInGarrison', count, { silent: true })
        game.state.conflict.deployedTroops[player.name] = (game.state.conflict.deployedTroops[player.name] || 0) + count
      }
    }
  },

}
