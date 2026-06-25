'use strict'

const factions = require('../../../../systems/factions.js')
const constants = require('../../../constants.js')
module.exports = {
  id: "shifting-allegiances",
  name: "Shifting Allegiances",
  source: "Base",
  compatibility: "All",
  count: 2,
  persuasionCost: 3,
  acquisitionBonus: null,
  passiveAbility: null,
  agentIcons: [
    "green",
    "yellow"
  ],
  factionAccess: [],
  spyAccess: false,
  agentAbility: "Pay 1 Influence and 2 Spice:\n· +2 other Influence",
  revealPersuasion: 2,
  revealSwords: 0,
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

  agentEffect(game, player) {
    // Pay 1 Influence and 2 Spice to gain +2 other Influence
    if (player.spice >= 2) {
      const loseFactions = constants.FACTIONS.filter(f => player.getInfluence(f) > 0)
      if (loseFactions.length > 0) {
        const choices = [
          game.actions.option({ id: 'pass', title: 'Pass' }),
          ...loseFactions.map(f => game.actions.option({
            id: `lose-${f}`,
            title: `Lose 1 ${f} Influence + 2 Spice`,
            kind: 'faction',
          })),
        ]
        const [choice] = game.actions.choose(player, choices, { title: 'Shifting Allegiances' })
        const chId = typeof choice === 'object' ? choice.id : choice
        if (chId !== 'pass' && choice !== 'Pass') {
          const loseFaction = chId.startsWith('lose-')
            ? chId.slice('lose-'.length)
            : loseFactions.find(f => (typeof choice === 'string' ? choice : choice.title).includes(f))
          factions.loseInfluence(game, player, loseFaction, 1)
          player.decrementCounter('spice', 2, { silent: true })
          factions.gainInfluenceWithChoice(game, player, 2, 'Gain 2 Influence')
        }
      }
    }
  },

}
