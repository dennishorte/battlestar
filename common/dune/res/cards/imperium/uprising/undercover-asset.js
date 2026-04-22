'use strict'

const spies = require('../../../../systems/spies.js')
const constants = require('../../../constants.js')
const { addStrength } = require('../../../../systems/strengthBreakdown.js')

module.exports = {
  id: "undercover-asset",
  name: "Undercover Asset",
  source: "Uprising",
  compatibility: "Uprising",
  count: 1,
  persuasionCost: 2,
  acquisitionBonus: null,
  passiveAbility: null,
  agentIcons: [
    "green",
    "purple",
    "yellow"
  ],
  factionAccess: [],
  spyAccess: true,
  agentAbility: "Ignore Influence requirements on board spaces when sending an Agent this turn",
  revealPersuasion: 0,
  revealSwords: 0,
  revealAbility: "· +1 Spy\n  OR\n· +2 Daggers",
  factionAffiliation: "emperor",
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

  agentEffect(game) {
    // Ignore Influence requirements on board spaces this turn
    if (game.state.turnTracking) {
      game.state.turnTracking.ignoreInfluenceRequirements = true
    }
  },

  revealEffect(game, player) {
    const choices = ['+1 Spy', '+2 Swords']
    const [choice] = game.actions.choose(player, choices, { title: 'Undercover Asset' })
    if (choice.includes('Spy')) {
      spies.placeSpy(game, player)
    }
    else {
      addStrength(game, player, 'card', 'Undercover Asset', 2 * constants.SWORD_STRENGTH)
      game.log.add({ template: '{player}: +2 Swords', args: { player } })
    }
  },

}
