'use strict'

const factions = require('../../../../systems/factions.js')
const constants = require('../../../constants.js')
module.exports = {
  id: "captured-mentat",
  name: "Captured Mentat",
  source: "Uprising",
  compatibility: "All",
  count: 1,
  persuasionCost: 5,
  acquisitionBonus: null,
  passiveAbility: null,
  agentIcons: [
    "green",
    "yellow"
  ],
  factionAccess: [],
  spyAccess: false,
  agentAbility: "Discard 1 card →\n· +1 Intrigue card\n· Draw 1 card",
  revealPersuasion: 1,
  revealSwords: 0,
  revealAbility: "-1 Influence with a Faction -> +1 Influence with a Faction",
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
    const loseFactions = constants.FACTIONS.filter(f => player.getInfluence(f) > 0)
    if (loseFactions.length > 0) {
      const choices = [
        game.actions.option({ id: 'pass', title: 'Pass' }),
        ...loseFactions.map(f => game.actions.option({ id: `lose-${f}`, title: `Lose 1 ${f}`, kind: 'faction' })),
      ]
      const [choice] = game.actions.choose(player, choices, { title: 'Swap influence?' })
      const chId = typeof choice === 'object' ? choice.id : choice
      if (chId !== 'pass' && choice !== 'Pass') {
        const loseFaction = chId.startsWith('lose-')
          ? chId.slice('lose-'.length)
          : loseFactions.find(f => (typeof choice === 'string' ? choice : choice.title).includes(f))
        factions.loseInfluence(game, player, loseFaction, 1)
        const fc = constants.FACTIONS.map(f => game.actions.option({ id: f, title: f, kind: 'faction' }))
        const [gChoice] = game.actions.choose(player, fc, { title: '+1 Influence with:' })
        const gf = typeof gChoice === 'object' ? gChoice.id : gChoice
        factions.gainInfluence(game, player, gf)
      }
    }
  },

  previewReveal(game, player) {
    const canLose = constants.FACTIONS.some(f => player.getInfluence(f) > 0)
    return canLose
      ? { pending: 'Optional: -1 Influence with a Faction → +1 Influence with a Faction' }
      : {}
  },


  agentEffects: [
    {
      type: 'discard-card'
    },
    {
      type: 'intrigue',
      amount: 1
    },
    {
      type: 'draw',
      amount: 1
    }
  ],
}
