'use strict'

module.exports = {
  id: 'corrino-genes',
  name: 'Corrino Genes',
  source: 'Immortality',
  compatibility: 'All',
  count: 1,
  specimenCost: 1,
  acquisitionBonus: '+2 Solari',
  passiveAbility: null,
  agentIcons: [],
  factionAccess: ['emperor'],
  spyAccess: false,
  agentAbility: 'If grafted: +1 Beetle',
  revealPersuasion: 1,
  revealSwords: 0,
  revealAbility: null,
  factionAffiliation: 'emperor',
  vpsAvailable: 0,
  hasTech: false,
  hasShipping: false,
  hasUnload: false,
  hasInfiltration: false,
  hasResearch: true,
  hasGrafting: false,
  hasSpies: false,
  hasSandworms: false,
  hasContracts: false,
  hasBattleIcons: false,
  hasSardaukar: false,

  onAcquire(game, player, card, { resolveEffect }) {
    resolveEffect(game, player, { type: 'gain', resource: 'solari', amount: 2 }, null, card.name)
  },
}
