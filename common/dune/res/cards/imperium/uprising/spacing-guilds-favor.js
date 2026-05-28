'use strict'

const factions = require('../../../../systems/factions.js')
const constants = require('../../../constants.js')
module.exports = {
  id: "spacing-guilds-favor",
  name: "Spacing Guild's Favor",
  source: "Uprising",
  compatibility: "All",
  count: 2,
  persuasionCost: 5,
  acquisitionBonus: null,
  passiveAbility: "When this card is discarded:\n· +2 Spice",
  agentIcons: [],
  factionAccess: [],
  spyAccess: false,
  agentAbility: "Draw 1 card",
  revealPersuasion: 2,
  revealSwords: 0,
  revealAbility: "Spend 3 Spice → +1 Influence with any Faction",
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

  onDiscard(game, player) {
    // "When this card is discarded: +2 Spice"
    if (!player) {
      return
    }
    player.incrementCounter('spice', 2, { silent: true })
    game.log.add({
      template: "{player}: Spacing Guild's Favor discarded — +2 Spice",
      args: { player },
    })
  },

  revealEffect(game, player) {
    if (player.spice >= 3) {
      const choices = ['Pass', 'Pay 3 Spice for +1 Influence']
      const [choice] = game.actions.choose(player, choices, { title: "Spacing Guild's Favor" })
      if (choice !== 'Pass') {
        player.decrementCounter('spice', 3, { silent: true })
        const [faction] = game.actions.choose(player, constants.FACTIONS, { title: '+1 Influence with:' })
        factions.gainInfluence(game, player, faction)
      }
    }
  },

  previewReveal(game, player) {
    return player.spice >= 3
      ? { pending: 'Optional: spend 3 Spice → +1 Influence (any faction)' }
      : {}
  },

}
