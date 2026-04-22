'use strict'

module.exports = {
  id: "expedite",
  name: "Expedite",
  source: "Rise of Ix",
  compatibility: "All",
  count: 1,
  hasTech: false,
  hasShipping: true,
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
    // Pay 1 Spice -> Move Freighter (expansion) — stub
    game.log.add({ template: '{player}: Expedite — Freighter not available (expansion)', args: { player }, event: 'memo' })
  },

}
