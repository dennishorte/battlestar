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
  plotText: "Remove and replace a card in the Imperium Row; during your Reveal turn this round, you may acquire the removed card for 1 less Persuasion",

  plotEffect(game, player) {
    // Remove and replace a card in Imperium Row — complex market manipulation
    game.log.add({ template: '{player}: Manipulate — Imperium Row manipulation', args: { player }, event: 'memo' })
  },

}
