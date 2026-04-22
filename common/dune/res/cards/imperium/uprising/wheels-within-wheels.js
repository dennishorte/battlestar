'use strict'

module.exports = {
  id: "wheels-within-wheels",
  name: "Wheels within Wheels",
  source: "Uprising",
  compatibility: "Uprising",
  count: 1,
  persuasionCost: 2,
  acquisitionBonus: null,
  passiveAbility: null,
  agentIcons: [],
  factionAccess: [],
  spyAccess: true,
  agentAbility: "With 2 Influence with Emperor:\n· +2 Solari\nWith 2 Influence with Spacing Guild:\n· +1 Spice",
  revealPersuasion: 1,
  revealSwords: 0,
  revealAbility: "+1 Spy",
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

  agentEffect(game, player) {
    // With 2 Emperor Influence: +2 Solari. With 2 Guild Influence: +1 Spice.
    if (player.getInfluence('emperor') >= 2) {
      player.incrementCounter('solari', 2, { silent: true })
      game.log.add({ template: '{player}: +2 Solari (Emperor Influence)', args: { player } })
    }
    if (player.getInfluence('guild') >= 2) {
      player.incrementCounter('spice', 1, { silent: true })
      game.log.add({ template: '{player}: +1 Spice (Guild Influence)', args: { player } })
    }
  },

}
