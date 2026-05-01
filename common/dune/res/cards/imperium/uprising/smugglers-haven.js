'use strict'

module.exports = {
  id: "smugglers-haven",
  name: "Smuggler's Haven",
  source: "Uprising",
  compatibility: "Uprising",
  count: 1,
  persuasionCost: 4,
  acquisitionBonus: null,
  passiveAbility: null,
  agentIcons: [
    "yellow"
  ],
  factionAccess: [
    "guild"
  ],
  spyAccess: false,
  agentAbility: "4 Spice -> 1 Victory Point",
  revealPersuasion: 1,
  revealSwords: 0,
  revealAbility: "If you are occupying a Maker board space: +2 Spice",
  factionAffiliation: "guild",
  vpsAvailable: 1,
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
    // Pay 4 Spice -> +1 VP
    if (player.spice >= 4) {
      const choices = ['Pass', 'Pay 4 Spice for +1 Victory Point']
      const [choice] = game.actions.choose(player, choices, { title: 'Smuggler\'s Haven' })
      if (choice !== 'Pass') {
        player.decrementCounter('spice', 4, { silent: true })
        player.gainVp(1, "Smuggler's Haven")
        game.log.add({ template: '{player} gains 1 Victory Point', args: { player } })
      }
    }
  },

}
