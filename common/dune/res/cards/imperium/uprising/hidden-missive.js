'use strict'

const deckEngine = require('../../../../systems/deckEngine.js')
module.exports = {
  id: "hidden-missive",
  name: "Hidden Missive",
  source: "Uprising",
  compatibility: "All",
  count: 1,
  persuasionCost: 2,
  acquisitionBonus: null,
  passiveAbility: null,
  agentIcons: [
    "green"
  ],
  factionAccess: [],
  spyAccess: false,
  agentAbility: "2 Influence with Bene Gesserit:\n· Get 1 Troop\n· Draw a card",
  revealPersuasion: 1,
  revealSwords: 1,
  revealAbility: null,
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

  agentEffect(game, player) {
    // With 2 BG Influence: +1 Troop & Draw a card
    if (player.getInfluence('bene-gesserit') >= 2) {
      const recruit = Math.min(1, player.troopsInSupply)
      if (recruit > 0) {
        player.decrementCounter('troopsInSupply', recruit, { silent: true })
        player.incrementCounter('troopsInGarrison', recruit, { silent: true })
      }
      deckEngine.drawCards(game, player, 1)
      game.log.add({ template: '{player}: +1 Troop, Draw 1 card', args: { player } })
    }
  },

}
