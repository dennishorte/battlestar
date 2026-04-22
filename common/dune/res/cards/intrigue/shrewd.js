'use strict'

module.exports = {
  id: "shrewd",
  name: "Shrewd",
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
  plotEffect: null,
  endgameEffect: null,

  combatEffect(game, player) {
    const deployed = game.state.conflict.deployedTroops[player.name] || 0
    if (deployed > 0) {
      game.state.conflict.deployedTroops[player.name]--
      player.incrementCounter('troopsInSupply', 1, { silent: true })
      player.incrementCounter('spice', 1, { silent: true })
      game.log.add({ template: '{player}: Loses 1 troop, +1 Spice', args: { player } })
    }
  },

}
