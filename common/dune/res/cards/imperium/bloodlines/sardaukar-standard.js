'use strict'

module.exports = {
  id: "sardaukar-standard",
  name: "Sardaukar Standard",
  source: "Bloodlines",
  compatibility: "Bloodlines",
  count: 1,
  persuasionCost: 4,
  acquisitionBonus: null,
  passiveAbility: null,
  whenTrashedAbility: "When this card is trashed:\n· Acquire and recruit the Sardaukar Commander in the bank",
  agentIcons: [
    "purple"
  ],
  factionAccess: [
    "emperor"
  ],
  spyAccess: false,
  agentAbility: null,
  revealPersuasion: 2,
  revealSwords: 0,
  revealAbility: "+1 Troop",
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
  hasSardaukar: true,

  onTrash(game, player) {
    if (!player) {
      return
    }
    game.log.add({
      template: '{player}: Sardaukar Standard trashed — acquire and recruit a Sardaukar Commander (manual)',
      args: { player },
      event: 'memo',
    })
  },

  revealEffects: [
    {
      type: 'troop',
      amount: 1
    }
  ],
}
