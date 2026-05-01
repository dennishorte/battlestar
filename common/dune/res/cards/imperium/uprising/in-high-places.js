'use strict'

module.exports = {
  id: "in-high-places",
  name: "In High Places",
  source: "Uprising",
  compatibility: "Uprising",
  count: 1,
  persuasionCost: 5,
  acquisitionBonus: "+1 Spy",
  passiveAbility: null,
  agentIcons: [],
  factionAccess: [
    "emperor",
    "bene-gesserit"
  ],
  spyAccess: false,
  agentAbility: "If you have another Bene Gesserit card in play:\n· Draw 1 card\n· +1 Spy",
  revealPersuasion: 2,
  revealSwords: 0,
  revealAbility: "Recall 2 Spies -> +3 Persuasion",
  factionAffiliation: "emperor",
  vpsAvailable: 0,
  hasTech: false,
  hasShipping: false,
  hasUnload: false,
  hasInfiltration: false,
  hasResearch: false,
  hasGrafting: false,
  hasSpies: true,
  hasSandworms: false,
  hasContracts: false,
  hasBattleIcons: false,
  hasSardaukar: false,

  onAcquire(game, player, card, { resolveEffect }) {
    resolveEffect(game, player, { type: 'spy' }, null, card.name)
  },
}
