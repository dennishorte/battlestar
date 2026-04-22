'use strict'

module.exports = {
  id: "staged-incident",
  name: "Staged Incident",
  source: "Base",
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
  vpsAvailable: 1,
  plotEffect: null,
  endgameEffect: null,

  combatEffect(game, player) {
    const deployed = game.state.conflict.deployedTroops[player.name] || 0
    if (deployed >= 3) {
      game.state.conflict.deployedTroops[player.name] -= 3
      player.incrementCounter('troopsInSupply', 3, { silent: true })
      player.incrementCounter('vp', 1, { silent: true })
      game.log.add({ template: '{player}: Loses 3 troops, +1 VP', args: { player } })
    }
  },

}
