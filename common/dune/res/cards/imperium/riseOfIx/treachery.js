'use strict'

const deploy = require('../../../../systems/deploy.js')

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
    const recruit = deploy.recruitTroops(game, player, 2, {
      to: 'conflict',
      silent: true,
    })
    if (recruit > 0) {
      game.log.add({ template: '{player}: +{count} troops to Conflict', args: { player, count: recruit } })
    }
  },

  previewReveal(game, player) {
    return { deployFromSupply: Math.min(2, player.troopsInSupply) }
  },


  agentEffects: [
    {
      type: 'extra-influence'
    },
    {
      type: 'trash-self'
    }
  ],
}
