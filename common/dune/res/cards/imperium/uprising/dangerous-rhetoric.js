'use strict'

const deckEngine = require('../../../../systems/deckEngine.js')
const factions = require('../../../../systems/factions.js')
const constants = require('../../../constants.js')
module.exports = {
  id: "dangerous-rhetoric",
  name: "Dangerous Rhetoric",
  source: "Uprising",
  compatibility: "Uprising",
  count: 1,
  persuasionCost: 3,
  acquisitionBonus: null,
  passiveAbility: null,
  agentIcons: [
    "green"
  ],
  factionAccess: [],
  spyAccess: true,
  agentAbility: "· 1 Influence with a Faction\n· Trash this card",
  revealPersuasion: 1,
  revealSwords: 1,
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
    // +1 Influence with a Faction. Trash this card.
    const fc = constants.FACTIONS.map(f => game.actions.option({ id: f, title: f, kind: 'faction' }))
    const [fChoice] = game.actions.choose(player, fc, {
      title: 'Choose faction for +1 Influence',
    })
    const faction = typeof fChoice === 'object' ? fChoice.id : fChoice
    factions.gainInfluence(game, player, faction)
    deckEngine.trashCard(game, card)
  },

}
