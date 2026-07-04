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
      const choices = [
        game.actions.option({ id: 'pass', title: 'Pass' }),
        game.actions.option({ id: 'retreat', title: 'Retreat 3 troops for +1 Influence' }),
      ]
      const [choice] = game.actions.choose(player, choices, { title: 'Negotiated Withdrawal' })
      const chId = typeof choice === 'object' ? choice.id : choice
      if (chId !== 'pass' && choice !== 'Pass') {
        game.state.conflict.deployedTroops[player.name] -= 3
        player.incrementCounter('troopsInSupply', 3)
        const fc = constants.FACTIONS.map(f => game.actions.option({ id: f, title: f, kind: 'faction' }))
        const [fChoice] = game.actions.choose(player, fc, { title: '+1 Influence with:' })
        const faction = typeof fChoice === 'object' ? fChoice.id : fChoice
        factions.gainInfluence(game, player, faction)
      }
    }
  },

  previewReveal(game, player) {
    const deployed = game.state.conflict?.deployedTroops?.[player.name] || 0
    return deployed >= 3
      ? { pending: 'Optional: retreat 3 troops → +1 Influence (any faction)' }
      : {}
  },

  onAcquire(game, player, card, { resolveEffect }) {
    resolveEffect(game, player, { type: 'troop', amount: 1 }, null, card.name)
  },

}
