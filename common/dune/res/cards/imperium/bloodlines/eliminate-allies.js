'use strict'

const deploy = require('../../../../systems/deploy.js')

module.exports = {
  id: "eliminate-allies",
  name: "Eliminate Allies",
  source: "Bloodlines",
  compatibility: "Uprising",
  count: 1,
  persuasionCost: 2,
  acquisitionBonus: null,
  passiveAbility: null,
  whenTrashedAbility: "When this card is trashed:\n· +2 Troops",
  agentIcons: [],
  factionAccess: [],
  spyAccess: true,
  agentAbility: "Trash a card",
  revealPersuasion: 1,
  revealSwords: 1,
  revealAbility: null,
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

  onTrash(game, player) {
    if (!player) {
      return
    }
    const recruit = deploy.recruitTroops(game, player, 2, { silent: true })
    game.log.add({
      template: '{player}: Eliminate Allies trashed — +{amount} Troop(s)',
      args: { player, amount: recruit },
    })
  },

  agentEffects: [
    {
      type: 'trash-card'
    }
  ],
}
