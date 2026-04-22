'use strict'

module.exports = {
  id: "desert-ambush",
  name: "Desert Ambush",
  source: "Rise of Ix",
  compatibility: "All",
  count: 1,
  persuasionCost: 3,
  acquisitionBonus: null,
  passiveAbility: null,
  agentIcons: [
    "yellow"
  ],
  factionAccess: [],
  spyAccess: false,
  agentAbility: "For each troop you deploy this turn, you may force an enemy unit to retreat",
  revealPersuasion: 1,
  revealSwords: 1,
  revealAbility: null,
  factionAffiliation: "fremen",
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
    // For each troop you deploy this turn, force an enemy unit to retreat
    if (game.state.turnTracking) {
      game.state.turnTracking.forceRetreatOnDeploy = true
    }
  },

}
