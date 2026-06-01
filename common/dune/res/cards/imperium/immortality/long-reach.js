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
    // If you have another BG card in play: this card gets all access. +1 Influence with 2 Factions.
    if (constants.hasOtherFactionAffiliatedCardInPlay(game, player, card, 'bene-gesserit')) {
      for (let i = 0; i < 2; i++) {
        const fc = constants.FACTIONS.map(f => game.actions.option({ id: f, title: f, kind: 'faction' }))
        const [fChoice] = game.actions.choose(player, fc, {
          title: `+1 Influence (${i + 1} of 2)`,
        })
        const faction = typeof fChoice === 'object' ? fChoice.id : fChoice
        factions.gainInfluence(game, player, faction)
      }
    }
  },


  revealEffects: [
    {
      type: 'intrigue',
      amount: 1
    }
  ],
}
