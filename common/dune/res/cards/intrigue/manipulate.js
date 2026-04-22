'use strict'

module.exports = {
  id: "manipulate",
  name: "Manipulate",
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
    // Remove and replace a card in Imperium Row — complex market manipulation
    game.log.add({ template: '{player}: Manipulate — Imperium Row manipulation', args: { player }, event: 'memo' })
  },

}
