'use strict'

module.exports = {
  id: "guild-accord",
  name: "Guild Accord",
  source: "Rise of Ix",
  compatibility: "All",
  count: 1,
  persuasionCost: 6,
  acquisitionBonus: null,
  passiveAbility: null,
  agentIcons: [],
  factionAccess: [
    "guild"
  ],
  spyAccess: false,
  agentAbility: "It costs 2 Spice less to send an Agent to the Heighliner board space with this card",
  revealPersuasion: 0,
  revealSwords: 0,
  revealAbility: "· +1 Water\nWith 2 Spacing Guild Alliance:\n· +3 Spice",
  factionAffiliation: "guild",
  vpsAvailable: 0,
  hasTech: false,
  hasShipping: false,
  hasUnload: true,
  hasInfiltration: true,
  hasResearch: false,
  hasGrafting: false,
  hasSpies: false,
  hasSandworms: false,
  hasContracts: false,
  hasBattleIcons: false,
  hasSardaukar: false,

  agentEffect(game) {
    // Heighliner costs 2 Spice less this turn — modifier
    if (game.state.turnTracking) {
      game.state.turnTracking.heighlinerDiscount = 2
    }
  },

  revealEffect(game, player) {
    player.incrementCounter('water', 1, { silent: true })
    if (game.state.alliances.guild === player.name) {
      player.incrementCounter('spice', 3, { silent: true })
      game.log.add({ template: '{player}: +1 Water, +3 Spice (Guild Alliance)', args: { player } })
    }
    else {
      game.log.add({ template: '{player}: +1 Water', args: { player } })
    }
  },

}
