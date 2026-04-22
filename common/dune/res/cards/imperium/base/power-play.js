'use strict'

const deckEngine = require('../../../../systems/deckEngine.js')
module.exports = {
  id: "power-play",
  name: "Power Play",
  source: "Base",
  compatibility: "All",
  count: 3,
  persuasionCost: 5,
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
  agentAbility: "· +2 Influence instead of +1 Influence\n· Trash this card",
  revealPersuasion: 0,
  revealSwords: 0,
  revealAbility: null,
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

  agentEffect(game, player, card) {
    // +2 Influence instead of +1 Influence and Trash this card
    // The "instead of +1" modifies the faction space influence gain
    if (game.state.turnTracking) {
      game.state.turnTracking.extraInfluence = true
    }
    deckEngine.trashCard(game, card)
  },

}
