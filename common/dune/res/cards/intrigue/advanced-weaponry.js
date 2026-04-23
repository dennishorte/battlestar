'use strict'

module.exports = {
  id: "advanced-weaponry",
  name: "Advanced Weaponry",
  source: "Rise of Ix",
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
  vpsAvailable: 0,
  endgameEffect: null,
  plotText: "Pay 3 Solari → +1 Dreadnought",
  combatText: "If you have three or more Tech tiles: +4 Swords",

  plotEffect(game, player) {
    // Pay 3 Solari -> +1 Dreadnought (expansion) — stub: log
    game.log.add({ template: '{player}: Advanced Weaponry — Dreadnought not available (expansion)', args: { player }, event: 'memo' })
  },

  combatEffect(game, player) {
    // Tech tiles condition (expansion) — stub
    game.log.add({ template: '{player}: Advanced Weaponry — Tech tiles not tracked (expansion)', args: { player }, event: 'memo' })
  },

}
