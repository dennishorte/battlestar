'use strict'

module.exports = {
  id: "maker-keeper",
  name: "Maker Keeper",
  source: "Uprising",
  compatibility: "All",
  count: 2,
  persuasionCost: 2,
  acquisitionBonus: null,
  passiveAbility: null,
  agentIcons: [
    "purple"
  ],
  factionAccess: [],
  spyAccess: false,
  agentAbility: "2 Influence with Bene Gesserit:\n· +1 Water\n2 Influence with Fremen:\n· +1 Spice",
  revealPersuasion: 2,
  revealSwords: 0,
  revealAbility: null,
  factionAffiliation: "bene-gesserit",
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

  agentEffect(game, player) {
    // With 2 BG Influence: +1 Water. With 2 Fremen Influence: +1 Spice.
    if (player.getInfluence('bene-gesserit') >= 2) {
      player.incrementCounter('water', 1, { silent: true })
      game.log.add({ template: '{player}: +1 Water (BG Influence)', args: { player } })
    }
    if (player.getInfluence('fremen') >= 2) {
      player.incrementCounter('spice', 1, { silent: true })
      game.log.add({ template: '{player}: +1 Spice (Fremen Influence)', args: { player } })
    }
  },

}
