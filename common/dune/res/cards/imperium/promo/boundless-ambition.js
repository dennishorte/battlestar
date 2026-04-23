'use strict'

module.exports = {
  id: "boundless-ambition",
  name: "Boundless Ambition",
  source: "Promo",
  compatibility: "All",
  count: 1,
  persuasionCost: 5,
  acquisitionBonus: null,
  passiveAbility: null,
  agentIcons: [],
  factionAccess: [
    "emperor",
    "guild",
    "bene-gesserit",
    "fremen"
  ],
  spyAccess: false,
  agentAbility: "Signet Ring",
  revealPersuasion: 0,
  revealSwords: 0,
  revealAbility: "Acquire a card that costs 5 Persuation or less",
  factionAffiliation: null,
  vpsAvailable: 0,
  hasTech: false,
  hasShipping: false,
  hasUnload: true,
  hasInfiltration: false,
  hasResearch: false,
  hasGrafting: false,
  hasSpies: false,
  hasSandworms: false,
  hasContracts: false,
  hasBattleIcons: false,
  hasSardaukar: false,

  agentEffect(game, player) {
    // Signet Ring — this triggers the leader's signet ring ability
    const leaders = require('../../../../systems/leaders.js')
    const { resolveEffect: re } = require('../../../../phases/playerTurns.js')
    leaders.resolveSignetRing(game, player, re)
  },

  revealEffect(game, player) {
    if (game.state.turnTracking) {
      game.state.turnTracking.freeAcquire5 = true
    }
    game.log.add({ template: '{player}: May acquire a card costing 5 or less', args: { player }, event: 'memo' })
  },

}
