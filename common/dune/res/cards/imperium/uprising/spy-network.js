'use strict'

module.exports = {
  id: "spy-network",
  name: "Spy Network",
  source: "Uprising",
  compatibility: "Uprising",
  count: 1,
  persuasionCost: 2,
  acquisitionBonus: "+1 Spy",
  passiveAbility: null,
  agentIcons: [],
  factionAccess: [],
  spyAccess: false,
  agentAbility: null,
  revealPersuasion: 2,
  revealSwords: 1,
  revealAbility: "If you have two or more Spies on the board:\n· Recall a Spy → Get an Intrigue card",
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
