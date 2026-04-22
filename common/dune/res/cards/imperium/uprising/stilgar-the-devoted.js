'use strict'

module.exports = {
  id: "stilgar-the-devoted",
  name: "Stilgar, The Devoted",
  source: "Uprising",
  compatibility: "All",
  count: 1,
  persuasionCost: 6,
  acquisitionBonus: null,
  passiveAbility: null,
  agentIcons: [
    "purple",
    "yellow"
  ],
  factionAccess: [
    "fremen"
  ],
  spyAccess: false,
  agentAbility: "+2 Troops",
  revealPersuasion: 2,
  revealSwords: 0,
  revealAbility: "+2 Persuasion for each Fremen card you have in play (including this one)",
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

  revealEffect(game, player, card, allRevealedCards) {
    const fremenCount = allRevealedCards.filter(c =>
      c.factionAffiliation && c.factionAffiliation.toLowerCase().includes('fremen')
    ).length
    const total = fremenCount * 2
    if (total > 0) {
      player.incrementCounter('persuasion', total, { silent: true })
      game.log.add({ template: '{player}: +{total} Persuasion ({count} Fremen)', args: { player, total, count: fremenCount } })
    }
  },

}
