'use strict'

const factions = require('../../../../systems/factions.js')
const constants = require('../../../constants.js')
module.exports = {
  id: "long-reach",
  name: "Long Reach",
  source: "Immortality",
  compatibility: "All",
  count: 1,
  persuasionCost: 6,
  acquisitionBonus: null,
  passiveAbility: null,
  agentIcons: [],
  factionAccess: [],
  spyAccess: false,
  agentAbility: "If you have another Bene Gesserit card in play, this card has Green, Purple, and Yellow access\n· +1 Influence with 2 Factions of your choice",
  revealPersuasion: 1,
  revealSwords: 0,
  revealAbility: "+1 Intrigue card",
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

  agentEffect(game, player, card) {
    if (constants.hasOtherFactionAffiliatedCardInPlay(game, player, card, 'bene-gesserit')) {
      factions.gainInfluenceWithChoice(game, player, 2, '+1 Influence with 2 Factions')
    }
  },


  revealEffects: [
    {
      type: 'intrigue',
      amount: 1
    }
  ],
}
