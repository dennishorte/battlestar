'use strict'

const constants = require('../../../constants.js')
const { addStrength } = require('../../../../systems/strengthBreakdown.js')

module.exports = {
  id: "chani-clever-tactician",
  name: "Chani, Clever Tactician",
  source: "Uprising",
  compatibility: "All",
  count: 1,
  persuasionCost: 5,
  acquisitionBonus: null,
  passiveAbility: null,
  agentIcons: [
    "purple",
    "yellow"
  ],
  factionAccess: [
    "fremen"
  ],
  spyAccess: false,
  agentAbility: "If you have three or more units in the conflict:\n· +1 Intrigue card",
  revealPersuasion: 0,
  revealSwords: 0,
  revealAbility: "Retreat two of your troops → 4 Swords\nFremen Bond:\n· +2 Persuasion",
  factionAffiliation: "fremen",
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

  revealEffect(game, player, card, allRevealedCards) {
    const deployed = game.state.conflict.deployedTroops[player.name] || 0
    if (deployed >= 2) {
      const choices = ['Pass', 'Retreat 2 troops for +4 Swords']
      const [choice] = game.actions.choose(player, choices, { title: 'Chani' })
      if (choice !== 'Pass') {
        game.state.conflict.deployedTroops[player.name] -= 2
        player.incrementCounter('troopsInSupply', 2, { silent: true })
        addStrength(game, player, 'card', 'Chani, Clever Tactician', 4 * constants.SWORD_STRENGTH)
      }
    }
    const hasFremen = allRevealedCards.some(c =>
      c !== card && c.factionAffiliation && c.factionAffiliation.toLowerCase().includes('fremen')
    )
    if (hasFremen) {
      player.incrementCounter('persuasion', 2, { silent: true })
      game.log.add({ template: '{player}: Fremen Bond — +2 Persuasion', args: { player } })
    }
  },

}
