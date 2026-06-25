'use strict'

module.exports = {
  id: "replacement-eyes",
  name: "Replacement Eyes",
  source: "Immortality",
  compatibility: "Immortality",
  count: 1,
  persuasionCost: 5,
  acquisitionBonus: null,
  passiveAbility: null,
  whenTrashedAbility: "When this card is trashed:\n· +1 Beetle",
  agentIcons: [
    "purple"
  ],
  factionAccess: [],
  spyAccess: false,
  agentAbility: "Trash a card -> Draw 1 card",
  revealPersuasion: 1,
  revealSwords: 1,
  revealAbility: null,
  factionAffiliation: null,
  vpsAvailable: 0,
  hasTech: false,
  hasShipping: false,
  hasUnload: false,
  hasInfiltration: false,
  hasResearch: false,
  hasGrafting: true,
  hasSpies: false,
  hasSandworms: false,
  hasContracts: false,
  hasBattleIcons: false,
  hasSardaukar: false,

  onTrash(game, player) {
    if (!player) {
      return
    }
    game.log.add({
      template: '{player}: Replacement Eyes trashed — +1 Beetle (manual)',
      args: { player },
      event: 'memo',
    })
  },

  agentEffects: [
    {
      type: 'trash-card'
    },
    {
      type: 'draw',
      amount: 1
    }
  ],
}
