'use strict'

module.exports = {
  id: "weirding-way",
  name: "Weirding Way",
  source: "Rise of Ix",
  compatibility: "All",
  count: 1,
  persuasionCost: 3,
  acquisitionBonus: null,
  passiveAbility: null,
  agentIcons: [
    "purple",
    "yellow"
  ],
  factionAccess: [],
  spyAccess: false,
  agentAbility: "You may take another turn immediately after this one",
  revealPersuasion: 1,
  revealSwords: 2,
  revealAbility: null,
  factionAffiliation: "bene-gesserit",
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
    // You may take another turn immediately after this one
    if (game.state.turnTracking) {
      game.state.turnTracking.extraTurn = true
    }
  },

}
