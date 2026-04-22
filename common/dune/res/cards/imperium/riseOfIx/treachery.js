'use strict'

module.exports = {
  id: "treachery",
  name: "Treachery",
  source: "Rise of Ix",
  compatibility: "All",
  count: 2,
  persuasionCost: 6,
  acquisitionBonus: null,
  passiveAbility: null,
  agentIcons: [],
  factionAccess: [
    "emperor",
    "guild",
    "bene-gesserit",
    "fremen"
  ],
  spyAccess: false,
  agentAbility: "· Gain 2 Influence instead of one\n· Trash this card",
  revealPersuasion: 0,
  revealSwords: 0,
  revealAbility: "+2 Troops, deploy these Troops to the Conflict",
  factionAffiliation: null,
  vpsAvailable: 0,
  hasTech: false,
  hasShipping: false,
  hasUnload: true,
  hasInfiltration: false,
  hasResearch: false,
  hasGrafting: false,
  hasSpies: false,
  hasSandworms: false,
  hasContracts: false,
  hasBattleIcons: false,
  hasSardaukar: false,

  revealEffect(game, player) {
    const recruit = Math.min(2, player.troopsInSupply)
    if (recruit > 0) {
      player.decrementCounter('troopsInSupply', recruit, { silent: true })
      game.state.conflict.deployedTroops[player.name] = (game.state.conflict.deployedTroops[player.name] || 0) + recruit
      game.log.add({ template: '{player}: +{count} troops to Conflict', args: { player, count: recruit } })
    }
  },

}
