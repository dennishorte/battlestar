'use strict'

module.exports = {
  id: "leverage",
  name: "Leverage",
  source: "Uprising",
  compatibility: "All",
  count: 1,
  hasTech: false,
  hasShipping: false,
  hasResearch: false,
  hasSpies: false,
  hasSandworms: false,
  hasContracts: true,
  hasBattleIcons: false,
  hasSardaukar: false,
  isTwisted: false,
  vpsAvailable: 0,
  combatEffect: null,
  endgameEffect: null,
  plotText: "If you gained Spice this turn: +1 Contract and +1 Solari",

  plotEffect(game, player) {
    const gained = game.state.turnTracking?.spiceGained || 0
    if (gained > 0) {
      const choam = require('../../../systems/choam.js')
      choam.takeContract(game, player)
      player.incrementCounter('solari', 1, { silent: true })
      game.log.add({ template: '{player}: +1 Contract, +1 Solari', args: { player } })
    }
  },

}
