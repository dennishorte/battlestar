'use strict'

module.exports = {
  id: "full-scale-assault",
  name: "Full-Scale Assault",
  source: "Rise of Ix",
  compatibility: "Tech (Rise of Ix)",
  count: 1,
  persuasionCost: 8,
  acquisitionBonus: "+1 Dreadnought",
  passiveAbility: null,
  agentIcons: [
    "purple"
  ],
  factionAccess: [
    "emperor"
  ],
  spyAccess: false,
  agentAbility: "+2 Troops",
  revealPersuasion: 2,
  revealSwords: 0,
  revealAbility: "+3 Swords for each of your dreadnoughts in the Conflict",
  factionAffiliation: "emperor",
  vpsAvailable: 0,
  hasTech: true,
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

  onAcquire(game, player) {
    game.log.add({
      template: '{player}: +1 Dreadnought (manual)',
      args: { player },
      event: 'memo',
    })
  },
}
