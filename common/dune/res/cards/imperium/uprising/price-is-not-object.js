'use strict'

module.exports = {
  id: "price-is-not-object",
  name: "Price is Not Object",
  source: "Uprising",
  compatibility: "All",
  count: 1,
  persuasionCost: 6,
  acquisitionBonus: "+2 Solari",
  passiveAbility: null,
  agentIcons: [],
  factionAccess: [
    "emperor",
    "bene-gesserit"
  ],
  spyAccess: false,
  agentAbility: "You may acquire a card to your hand using Solari instead of Persuasion",
  revealPersuasion: 2,
  revealSwords: 0,
  revealAbility: "+2 Solari",
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
    // You may acquire a card using Solari instead of Persuasion this round
    if (game.state.turnTracking) {
      game.state.turnTracking.acquireWithSolari = true
    }
  },

}
