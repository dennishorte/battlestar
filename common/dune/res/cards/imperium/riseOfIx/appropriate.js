'use strict'

module.exports = {
  id: "appropriate",
  name: "Appropriate",
  source: "Rise of Ix",
  compatibility: "Shipping (Rise of Ix)",
  count: 1,
  persuasionCost: 5,
  acquisitionBonus: "+1 Shipping track move",
  passiveAbility: null,
  agentIcons: [
    "green",
    "yellow"
  ],
  factionAccess: [],
  spyAccess: false,
  agentAbility: "With 2 Emperor Influence:\n· +1 Acquire Tech\n· May use Solari instead of Spice to pay",
  revealPersuasion: 2,
  revealSwords: 0,
  revealAbility: null,
  factionAffiliation: "emperor",
  vpsAvailable: 0,
  hasTech: false,
  hasShipping: true,
  hasUnload: false,
  hasInfiltration: false,
  hasResearch: false,
  hasGrafting: false,
  hasSpies: false,
  hasSandworms: false,
  hasContracts: false,
  hasBattleIcons: false,
  hasSardaukar: false,

  onAcquire(game, player) {
    game.log.add({
      template: '{player}: +1 Shipping track move (manual)',
      args: { player },
      event: 'memo',
    })
  },
}
