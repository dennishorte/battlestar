'use strict'

module.exports = {
  id: "strike-fleet",
  name: "Strike Fleet",
  source: "Uprising",
  compatibility: "Uprising",
  count: 1,
  persuasionCost: 5,
  acquisitionBonus: "+1 Spy",
  passiveAbility: null,
  agentIcons: [],
  factionAccess: [],
  spyAccess: true,
  agentAbility: "If you recalled a Spy this turn:\n· +3 Troops",
  revealPersuasion: 1,
  revealSwords: 3,
  revealAbility: null,
  factionAffiliation: null,
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
