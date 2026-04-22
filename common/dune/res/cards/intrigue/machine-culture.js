'use strict'

module.exports = {
  id: "machine-culture",
  name: "Machine Culture",
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
  vpsAvailable: 1,
  combatEffect: null,

  plotEffect(game, player) {
    // Acquire Tech (expansion) — stub
    game.log.add({ template: '{player}: Machine Culture — Tech not available (expansion)', args: { player }, event: 'memo' })
  },

  endgameEffect(game, player) {
    // 3+ Tech tiles -> +1 VP (expansion) — stub
    game.log.add({ template: '{player}: Machine Culture — Tech tiles not tracked (expansion)', args: { player }, event: 'memo' })
  },

}
