'use strict'

const constants = require('../../../constants.js')
const { addStrength } = require('../../../../systems/strengthBreakdown.js')

module.exports = {
  id: "worm-riders",
  name: "Worm Riders",
  source: "Base",
  compatibility: "All",
  count: 2,
  persuasionCost: 6,
  acquisitionBonus: null,
  passiveAbility: null,
  agentIcons: [
    "purple",
    "yellow"
  ],
  factionAccess: [],
  spyAccess: false,
  agentAbility: "+2 Spice",
  revealPersuasion: 0,
  revealSwords: 0,
  revealAbility: "Having 2 Fremen Influence:\n· +4 Swords\nHaving Fremen Alliance:\n· +2 Swords",
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

  revealEffect(game, player) {
    if (player.getInfluence('fremen') >= 2) {
      addStrength(game, player, 'card', 'Worm Riders (Fremen)', 4 * constants.SWORD_STRENGTH)
      game.log.add({ template: '{player}: +4 Swords (Fremen Influence)', args: { player } })
    }
    if (game.state.alliances.fremen === player.name) {
      addStrength(game, player, 'card', 'Worm Riders (Alliance)', 2 * constants.SWORD_STRENGTH)
      game.log.add({ template: '{player}: +2 Swords (Fremen Alliance)', args: { player } })
    }
  },

}
