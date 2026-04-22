'use strict'

module.exports = {
  id: "shaddams-favor",
  name: "Shaddam's Favor",
  source: "Uprising",
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
  combatEffect: null,
  endgameEffect: null,

  plotEffect(game, player) {
    const recruit = Math.min(1, player.troopsInSupply)
    if (recruit > 0) {
      player.decrementCounter('troopsInSupply', recruit, { silent: true })
      player.incrementCounter('troopsInGarrison', recruit, { silent: true })
    }
    if (player.getInfluence('emperor') >= 3) {
      player.incrementCounter('solari', 3, { silent: true })
      game.log.add({ template: '{player}: Emperor synergy — +3 Solari', args: { player } })
    }
  },

}
