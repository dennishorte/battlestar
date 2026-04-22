'use strict'

module.exports = {
  id: "southern-elders",
  name: "Southern Elders",
  source: "Uprising",
  compatibility: "All",
  count: 1,
  persuasionCost: 4,
  acquisitionBonus: null,
  passiveAbility: null,
  agentIcons: [],
  factionAccess: [
    "bene-gesserit",
    "fremen"
  ],
  spyAccess: false,
  agentAbility: "If you have another Bene Gesserit card in play:\n· +2 Troops",
  revealPersuasion: 0,
  revealSwords: 0,
  revealAbility: "· +1 Water\nFremen Bond:\n· +2 Persuasion",
  factionAffiliation: "bene-gesserit",
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
    player.incrementCounter('water', 1, { silent: true })
    game.log.add({ template: '{player}: +1 Water', args: { player } })
    const hasFremen = allRevealedCards.some(c =>
      c !== card && c.factionAffiliation && c.factionAffiliation.toLowerCase().includes('fremen')
    )
    if (hasFremen) {
      player.incrementCounter('persuasion', 2, { silent: true })
      game.log.add({ template: '{player}: Fremen Bond — +2 Persuasion', args: { player } })
    }
  },

}
