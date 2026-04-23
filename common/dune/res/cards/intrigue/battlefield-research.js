'use strict'

module.exports = {
  id: "battlefield-research",
  name: "Battlefield Research",
  source: "Bloodlines",
  compatibility: "All",
  count: 1,
  hasTech: true,
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
  combatText: "Retreat 1+ troops → Buy Tech at a 1 Spice discount",
  endgameText: "If you have three or more Tech tiles: +1 Victory Point",

  combatEffect(game, player) {
    // Retreat troops -> Buy Tech (expansion) — stub
    game.log.add({ template: '{player}: Battlefield Research — Tech not available (expansion)', args: { player }, event: 'memo' })
  },

  endgameEffect(game, player) {
    // 3+ Tech tiles -> +1 VP (expansion) — stub
    game.log.add({ template: '{player}: Battlefield Research — Tech tiles not tracked (expansion)', args: { player }, event: 'memo' })
  },

}
