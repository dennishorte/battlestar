'use strict'

const factions = require('../../../../systems/factions.js')
const constants = require('../../../constants.js')
module.exports = {
  id: "for-humanity",
  name: "For Humanity",
  source: "Immortality",
  compatibility: "All",
  count: 1,
  persuasionCost: 7,
  acquisitionBonus: null,
  passiveAbility: null,
  agentIcons: [
    "green",
    "yellow"
  ],
  factionAccess: [
    "bene-gesserit"
  ],
  spyAccess: false,
  agentAbility: "+1 Influence with any Faction",
  revealPersuasion: 2,
  revealSwords: 0,
  revealAbility: "With the Bene Gesserit Alliance:\n· -2 Influence with a Faction → +1 Victory Point",
  factionAffiliation: "bene-gesserit",
  vpsAvailable: 9,
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
    if (game.state.alliances['bene-gesserit'] === player.name) {
      const loseFactions = constants.FACTIONS.filter(f => player.getInfluence(f) >= 2)
      if (loseFactions.length > 0) {
        const choices = [
          game.actions.option({ id: 'pass', title: 'Pass' }),
          ...loseFactions.map(f => game.actions.option({ id: f, title: f, kind: 'faction' })),
        ]
        const [choice] = game.actions.choose(player, choices, { title: 'Lose 2 Influence for +1 VP?' })
        const chId = typeof choice === 'object' ? choice.id : choice
        if (chId !== 'pass' && choice !== 'Pass') {
          factions.loseInfluence(game, player, chId, 2)
          player.incrementCounter('vp', 1, { silent: true, source: 'For Humanity' })
          game.log.add({ template: '{player}: +1 VP', args: { player } })
        }
      }
    }
  },

  previewReveal(game, player) {
    // Card does nothing without the BG Alliance; only surface the optional
    // VP-for-influence trade when the gate is open AND you have something
    // to trade.
    if (game.state.alliances?.['bene-gesserit'] !== player.name) {
      return {}
    }
    const canLose = constants.FACTIONS.some(f => player.getInfluence(f) >= 2)
    if (!canLose) {
      return {}
    }
    return { pending: 'Optional: -2 Influence with a Faction → +1 VP' }
  },


  agentEffects: [
    {
      type: 'influence-choice',
      amount: 1
    }
  ],
}
