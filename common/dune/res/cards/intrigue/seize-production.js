'use strict'

module.exports = {
  id: "seize-production",
  name: "Seize Production",
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
  hasSardaukar: true,
  isTwisted: false,
  vpsAvailable: 0,
  combatEffect: null,
  endgameEffect: null,

  plotEffect(game, player) {
    // +2 Solari OR if Sardaukar Commanders in Conflict: +2 Spice
    // Sardaukar Commanders are Bloodlines expansion — just give +2 Solari for now
    player.incrementCounter('solari', 2, { silent: true })
    game.log.add({ template: '{player}: +2 Solari', args: { player } })
  },

}
