'use strict'

module.exports = {
  id: "holy-war",
  name: "Holy War",
  source: "Bloodlines",
  compatibility: "Uprising",
  count: 1,
  persuasionCost: 5,
  acquisitionBonus: null,
  passiveAbility: null,
  agentIcons: [
    "green"
  ],
  factionAccess: [
    "emperor",
    "guild",
    "bene-gesserit"
  ],
  spyAccess: false,
  agentAbility: "· Each opponent loses one troop\n· Each opponent spying on the board space where you sent an Agent this turn must move that Spy",
  revealPersuasion: 1,
  revealSwords: 0,
  revealAbility: "· +1 Troop\nFremen Bond:\n· Deploy troops",
  factionAffiliation: "fremen",
  vpsAvailable: 0,
  hasTech: false,
  hasShipping: false,
  hasUnload: false,
  hasInfiltration: false,
  hasResearch: false,
  hasGrafting: false,
  hasSpies: true,
  hasSandworms: false,
  hasContracts: false,
  hasBattleIcons: false,
  hasSardaukar: false,

  revealEffect(game, player, card, allRevealedCards) {
    const recruit = Math.min(1, player.troopsInSupply)
    if (recruit > 0) {
      player.decrementCounter('troopsInSupply', recruit, { silent: true })
      player.incrementCounter('troopsInGarrison', recruit, { silent: true })
    }
    const hasFremen = allRevealedCards.some(c =>
      c !== card && c.factionAffiliation && c.factionAffiliation.toLowerCase().includes('fremen')
    )
    if (hasFremen) {
      game.log.add({ template: '{player}: Fremen Bond — may deploy troops', args: { player }, event: 'memo' })
    }
  },

}
