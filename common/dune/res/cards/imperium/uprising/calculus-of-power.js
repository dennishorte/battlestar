'use strict'

const deckEngine = require('../../../../systems/deckEngine.js')
const constants = require('../../../constants.js')
const { addStrength } = require('../../../../systems/strengthBreakdown.js')

module.exports = {
  id: "calculus-of-power",
  name: "Calculus of Power",
  source: "Uprising",
  compatibility: "Uprising",
  count: 2,
  persuasionCost: 3,
  acquisitionBonus: null,
  passiveAbility: null,
  agentIcons: [
    "purple"
  ],
  factionAccess: [],
  spyAccess: true,
  agentAbility: "Trash a card",
  revealPersuasion: 2,
  revealSwords: 0,
  revealAbility: "Trash another Emperor card you have in play -> +3 Swords",
  factionAffiliation: "emperor",
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

  revealEffect(game, player) {
    const playedZone = game.zones.byId(`${player.name}.played`)
    const emperorCards = playedZone.cardlist().filter(c =>
      c.factionAffiliation && c.factionAffiliation.toLowerCase().includes('emperor')
    )
    if (emperorCards.length > 0) {
      const choices = ['Pass', ...emperorCards.map(c => c.name)]
      const [choice] = game.actions.choose(player, choices, { title: 'Trash Emperor card for +3 Swords?' })
      if (choice !== 'Pass') {
        const card = emperorCards.find(c => c.name === choice)
        if (card) {
          deckEngine.trashCard(game, card)
          addStrength(game, player, 'card', 'Calculus of Power', 3 * constants.SWORD_STRENGTH)
        }
      }
    }
  },

}
