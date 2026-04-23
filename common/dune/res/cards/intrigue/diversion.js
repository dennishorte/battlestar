'use strict'

module.exports = {
  id: "diversion",
  name: "Diversion",
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
  plotText: "When you deploy four or more units to the Conflict in a single turn: Move Freighter once",

  plotEffect(game, player) {
    // When deploy 4+ units: Move Freighter (expansion) — stub
    game.log.add({ template: '{player}: Diversion — Freighter not available (expansion)', args: { player }, event: 'memo' })
  },

}
