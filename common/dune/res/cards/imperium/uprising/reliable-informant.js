'use strict'

const spies = require('../../../../systems/spies.js')
module.exports = {
  id: "reliable-informant",
  name: "Reliable Informant",
  source: "Uprising",
  compatibility: "Uprising",
  count: 1,
  persuasionCost: 2,
  acquisitionBonus: null,
  passiveAbility: null,
  agentIcons: [],
  factionAccess: [],
  spyAccess: false,
  agentAbility: "Deploy a Spy on Emperor/Bene Gesserit/Fremen Observation Post",
  revealPersuasion: 1,
  revealSwords: 0,
  revealAbility: "+1 Solari",
  factionAffiliation: "guild",
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
    // Deploy a Spy on Emperor/BG/Fremen Observation Post
    spies.placeSpy(game, player)
  },

}
