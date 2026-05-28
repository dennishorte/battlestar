'use strict'

module.exports = {
  id: "tread-in-darkness",
  name: "Tread in Darkness",
  source: "Uprising",
  compatibility: "All",
  count: 2,
  persuasionCost: 4,
  acquisitionBonus: null,
  passiveAbility: null,
  agentIcons: [
    "green",
    "purple",
    "yellow"
  ],
  factionAccess: [],
  spyAccess: false,
  agentAbility: "If you have another Bene Gesserit card in play:\n· Trash a card\n· Draw a card",
  revealPersuasion: 2,
  revealSwords: 1,
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

  agentEffect(game, player, card, { resolveEffect }) {
    const constants = require('../../../constants.js')
    if (constants.hasOtherFactionAffiliatedCardInPlay(game, player, card, 'bene-gesserit')) {
      resolveEffect(game, player, { type: 'trash-card' }, null, card.name)
      resolveEffect(game, player, { type: 'draw', amount: 1 }, null, card.name)
    }
  },
}
