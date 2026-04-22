'use strict'

module.exports = {
  id: "sardaukar-coordination",
  name: "Sardaukar Coordination",
  source: "Uprising",
  compatibility: "All",
  count: 2,
  persuasionCost: 4,
  acquisitionBonus: null,
  passiveAbility: null,
  agentIcons: [
    "green"
  ],
  factionAccess: [
    "emperor"
  ],
  spyAccess: false,
  agentAbility: "You may deploy any troops you recruit this turn to the conflict",
  revealPersuasion: 0,
  revealSwords: 1,
  revealAbility: "+1 Sword for each Emperor card you revealed (including this one)",
  factionAffiliation: "emperor",
  vpsAvailable: 0,
  hasTech: false,
  hasShipping: false,
  hasUnload: false,
  hasInfiltration: false,
  hasResearch: false,
  hasGrafting: false,
  hasSpies: false,
  hasSandworms: false,
  hasContracts: false,
  hasBattleIcons: false,
  hasSardaukar: false,

  agentEffect(game) {
    // You may deploy any troops you recruit this turn to the conflict.
    if (game.state.turnTracking) {
      game.state.turnTracking.recruitToConflict = true
    }
  },

}
