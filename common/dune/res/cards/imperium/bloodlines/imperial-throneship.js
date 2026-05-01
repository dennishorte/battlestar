'use strict'

module.exports = {
  id: "imperial-throneship",
  name: "Imperial Throneship",
  source: "Bloodlines",
  compatibility: "All",
  count: 1,
  persuasionCost: 7,
  acquisitionBonus: "+1 Influence with the Emperor",
  passiveAbility: null,
  agentIcons: [
    "green",
    "purple",
    "yellow"
  ],
  factionAccess: [
    "emperor",
    "guild",
    "bene-gesserit"
  ],
  spyAccess: false,
  agentAbility: "+1 Intrigue",
  revealPersuasion: 2,
  revealSwords: 0,
  revealAbility: "If you have 4+ garrisoned units:\n· +1 Persuasion\n· +3 Solari",
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
