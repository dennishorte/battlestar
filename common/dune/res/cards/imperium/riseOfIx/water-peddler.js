'use strict'

module.exports = {
  id: "water-peddler",
  name: "Water Peddler",
  source: "Rise of Ix",
  compatibility: "All",
  count: 1,
  persuasionCost: 1,
  acquisitionBonus: "+1 Water",
  passiveAbility: null,
  agentIcons: [],
  factionAccess: [],
  spyAccess: false,
  agentAbility: null,
  revealPersuasion: 0,
  revealSwords: 0,
  revealAbility: "+1 Water",
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

  onAcquire(game, player, card, { resolveEffect }) {
    resolveEffect(game, player, { type: 'gain', resource: 'water', amount: 1 }, null, card.name)
  },
}
