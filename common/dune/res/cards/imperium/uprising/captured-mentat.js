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
      const choices = ['Pass', ...loseFactions.map(f => `Lose 1 ${f}`)]
      const [choice] = game.actions.choose(player, choices, { title: 'Swap influence?' })
      if (choice !== 'Pass') {
        const loseFaction = loseFactions.find(f => choice.includes(f))
        factions.loseInfluence(game, player, loseFaction, 1)
        const [gf] = game.actions.choose(player, constants.FACTIONS, { title: '+1 Influence with:' })
        factions.gainInfluence(game, player, gf)
      }
    }
  },

}
