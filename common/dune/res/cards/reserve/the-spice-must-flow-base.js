'use strict'

module.exports = {
  id: 'the-spice-must-flow-base',
  name: 'The Spice Must Flow (Base)',
  source: 'Base',
  compatibility: 'Dune Imperium (Base Only)',
  count: 10,
  persuasionCost: 9,
  acquisitionBonus: '+1 Victory Point',
  passiveAbility: null,
  agentIcons: [],
  factionAccess: [],
  agentAbility: null,
  revealPersuasion: 0,
  revealSwords: 0,
  revealAbility: '+1 Spice',
  factionAffiliation: null,

  onAcquire(game, player) {
    player.incrementCounter('vp', 1, { silent: true })
    game.log.add({
      template: '{player} gains 1 Victory Point (The Spice Must Flow)',
      args: { player },
    })
    const choam = require('../../../systems/choam.js')
    choam.checkContractCompletion(game, player, 'acquire-tsmf', {})
  },
}
