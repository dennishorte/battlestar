'use strict'

module.exports = {
  id: "assassination-mission",
  name: "Assassination Mission",
  source: "Base",
  compatibility: "All",
  count: 2,
  persuasionCost: 1,
  acquisitionBonus: null,
  passiveAbility: null,
  agentIcons: [],
  factionAccess: [],
  spyAccess: false,
  agentAbility: null,
  whenTrashedAbility: "When trashed by another card or effect:\n· +4 Solari",
  revealPersuasion: 0,
  revealSwords: 1,
  revealAbility: "+1 Solari",
  factionAffiliation: null,
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

  agentEffect() {
  },

  onTrash(game, player) {
    if (!player) {
      return
    }
    player.incrementCounter('solari', 4, { silent: true })
    game.log.add({
      template: '{player}: Assassination Mission trashed — gain 4 Solari',
      args: { player },
    })
  },

  revealEffects: [
    {
      type: 'gain',
      resource: 'solari',
      amount: 1
    }
  ],
}
