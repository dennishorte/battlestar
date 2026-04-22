'use strict'

const deckEngine = require('../../../../systems/deckEngine.js')
const factions = require('../../../../systems/factions.js')
module.exports = {
  id: "esmar-tuek",
  name: "Esmar Tuek",
  source: "Rise of Ix",
  compatibility: "All",
  count: 1,
  persuasionCost: 5,
  acquisitionBonus: null,
  passiveAbility: null,
  agentIcons: [
    "purple",
    "yellow"
  ],
  factionAccess: [],
  spyAccess: false,
  agentAbility: "Pay 1 Spice:\n· +1 Bene Gesserit Influence\n· Draw 1 card",
  revealPersuasion: 0,
  revealSwords: 0,
  revealAbility: "· +2 Spice\n· +2 Solari",
  factionAffiliation: "guild",
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

  agentEffect(game, player) {
    // Pay 1 Spice -> +1 BG Influence and Draw 1 card
    if (player.spice >= 1) {
      const choices = ['Pass', 'Pay 1 Spice for +1 BG Influence and Draw 1 card']
      const [choice] = game.actions.choose(player, choices, { title: 'Esmar Tuek' })
      if (choice !== 'Pass') {
        player.decrementCounter('spice', 1, { silent: true })
        factions.gainInfluence(game, player, 'bene-gesserit')
        deckEngine.drawCards(game, player, 1)
      }
    }
  },

}
