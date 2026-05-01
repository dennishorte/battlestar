'use strict'

module.exports = {
  id: "liet-kynes",
  name: "Liet Kynes",
  source: "Base",
  compatibility: "All",
  count: 1,
  persuasionCost: 5,
  acquisitionBonus: "+1 Influence with Emperor",
  passiveAbility: null,
  agentIcons: [
    "purple"
  ],
  factionAccess: [
    "fremen"
  ],
  spyAccess: false,
  agentAbility: null,
  revealPersuasion: 0,
  revealSwords: 0,
  revealAbility: "+2 Persuation for each Fremen card in play, including this one",
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

  onAcquire(game, player, card, { resolveEffect }) {
    resolveEffect(game, player, { type: 'influence', faction: 'emperor', amount: 1 }, null, card.name)
  },
}
