'use strict'

const spies = require('../../../systems/spies.js')
module.exports = {
  id: "false-orders",
  name: "False Orders",
  source: "Bloodlines",
  compatibility: "All",
  count: 1,
  hasTech: false,
  hasShipping: false,
  hasResearch: false,
  hasSpies: true,
  hasSandworms: false,
  hasContracts: false,
  hasBattleIcons: false,
  hasSardaukar: false,
  isTwisted: false,
  vpsAvailable: 0,
  combatEffect: null,
  endgameEffect: null,

  plotEffect(game, player) {
    // Move opponent spies from your space, then place your spy there
    spies.placeSpy(game, player)
    game.log.add({ template: '{player}: False Orders — places Spy', args: { player } })
  },

}
