'use strict'

module.exports = {
  id: "calculating",
  name: "Calculating",
  source: "Bloodlines",
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
  isTwisted: true,
  vpsAvailable: 0,
  combatEffect: null,
  endgameEffect: null,
  plotText: "For each type of unit you have in the Conflict: +1 Solari",

  plotEffect(game, player) {
    let types = 0
    if ((game.state.conflict.deployedTroops[player.name] || 0) > 0) {
      types++
    }
    if ((game.state.conflict.deployedSandworms[player.name] || 0) > 0) {
      types++
    }
    if (types > 0) {
      player.incrementCounter('solari', types, { silent: true })
      game.log.add({ template: '{player}: +{count} Solari ({count} unit types)', args: { player, count: types } })
    }
  },

}
