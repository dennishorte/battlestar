'use strict'

module.exports = {
  id: "interstellar-conspiracy",
  name: "Interstellar Conspiracy",
  source: "Immortality",
  compatibility: "All",
  count: 1,
  persuasionCost: 4,
  acquisitionBonus: null,
  passiveAbility: null,
  agentIcons: [
    "purple"
  ],
  factionAccess: [],
  spyAccess: false,
  agentAbility: "· +1 Spice\nIf grafted with an Emperor or Spacing Guild card:\n· +1 Influence with any Faction",
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
  hasGrafting: true,
  hasSpies: false,
  hasSandworms: false,
  hasContracts: false,
  hasBattleIcons: false,
  hasSardaukar: false,

  agentEffect(game, player) {
    // +1 Spice (grafted conditional is expansion — skip)
    player.incrementCounter('spice', 1, { silent: true })
    game.log.add({ template: '{player} gains 1 Spice', args: { player } })
  },

}
