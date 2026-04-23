'use strict'

const deckEngine = require('../../../../systems/deckEngine.js')
const factions = require('../../../../systems/factions.js')
const constants = require('../../../constants.js')
module.exports = {
  id: "choam-demands",
  name: "CHOAM Demands",
  source: "Bloodlines",
  compatibility: "Uprising",
  count: 1,
  persuasionCost: 6,
  acquisitionBonus: null,
  passiveAbility: null,
  agentIcons: [
    "green",
    "purple",
    "yellow"
  ],
  factionAccess: [],
  spyAccess: false,
  agentAbility: "Complete one of your contracts",
  revealPersuasion: 0,
  revealSwords: 0,
  revealAbility: "If you have completed 4+ Contracts:\n· Trash this card → +1 Influence with every Faction",
  factionAffiliation: "guild",
  vpsAvailable: 0,
  hasTech: false,
  hasShipping: false,
  hasUnload: false,
  hasInfiltration: false,
  hasResearch: false,
  hasGrafting: false,
  hasSpies: false,
  hasSandworms: false,
  hasContracts: true,
  hasBattleIcons: false,
  hasSardaukar: false,

  revealEffect(game, player, card) {
    const choam = require('../../../../systems/choam.js')
    if (choam.getCompletedContractCount(game, player) >= 4) {
      const choices = ['Pass', 'Trash this card for +1 Influence with every Faction']
      const [choice] = game.actions.choose(player, choices, { title: 'CHOAM Demands' })
      if (choice !== 'Pass') {
        deckEngine.trashCard(game, card)
        for (const faction of constants.FACTIONS) {
          factions.gainInfluence(game, player, faction)
        }
      }
    }
  },

}
