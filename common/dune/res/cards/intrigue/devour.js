'use strict'

const constants = require('../../constants.js')
const { addStrength } = require('../../../systems/strengthBreakdown.js')

module.exports = {
  id: "devour",
  name: "Devour",
  source: "Uprising",
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
  combatText: "+2 Swords; If you have 1+ Sandworm in the Conflict: +2 Swords and Trash a card",

  combatEffect(game, player, card, { resolveEffect }) {
    addStrength(game, player, 'intrigue', 'Devour', 2 * constants.SWORD_STRENGTH)
    const sandworms = game.state.conflict.deployedSandworms[player.name] || 0
    if (sandworms > 0) {
      addStrength(game, player, 'intrigue', 'Devour (Sandworm)', 2 * constants.SWORD_STRENGTH)
      resolveEffect(game, player, { type: 'trash-card' }, null, card.name)
      game.log.add({ template: '{player}: +4 Swords (Sandworm bonus)', args: { player } })
    }
    else {
      game.log.add({ template: '{player}: +2 Swords', args: { player } })
    }
  },

}
