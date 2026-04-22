'use strict'

const factions = require('../../../../systems/factions.js')
const constants = require('../../../constants.js')
module.exports = {
  id: "negotiated-withdrawal",
  name: "Negotiated Withdrawal",
  source: "Rise of Ix",
  compatibility: "All",
  count: 2,
  persuasionCost: 4,
  acquisitionBonus: "+1 Troop",
  passiveAbility: null,
  agentIcons: [
    "green",
    "purple",
    "yellow"
  ],
  factionAccess: [],
  spyAccess: false,
  agentAbility: null,
  revealPersuasion: 2,
  revealSwords: 0,
  revealAbility: "Retreat 3 of your Units --> +1 Influence",
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

  revealEffect(game, player) {
    const deployed = game.state.conflict.deployedTroops[player.name] || 0
    if (deployed >= 3) {
      const choices = ['Pass', 'Retreat 3 troops for +1 Influence']
      const [choice] = game.actions.choose(player, choices, { title: 'Negotiated Withdrawal' })
      if (choice !== 'Pass') {
        game.state.conflict.deployedTroops[player.name] -= 3
        player.incrementCounter('troopsInSupply', 3, { silent: true })
        const [faction] = game.actions.choose(player, constants.FACTIONS, { title: '+1 Influence with:' })
        factions.gainInfluence(game, player, faction)
      }
    }
  },

}
