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
    // Standard +1 already applied at agent placement; grant 1 more directly
    const factions = require('../../../../systems/factions.js')
    const constants = require('../../../constants.js')
    const faction = game.state.turnTracking?.spaceIcon
    if (faction && constants.FACTIONS.includes(faction)) {
      factions.gainInfluence(game, player, faction, 1)
    }
    deckEngine.trashCard(game, card)
  },

}
