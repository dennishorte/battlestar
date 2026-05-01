'use strict'

const deckEngine = require('../../../../systems/deckEngine.js')
module.exports = {
  id: "occupation",
  name: "Occupation",
  source: "Immortality",
  compatibility: "All",
  count: 1,
  persuasionCost: 8,
  acquisitionBonus: "+3 Troops",
  passiveAbility: null,
  agentIcons: [
    "purple",
    "yellow"
  ],
  factionAccess: [
    "emperor",
    "guild",
    "bene-gesserit",
    "fremen"
  ],
  spyAccess: false,
  agentAbility: "· Draw a card\n· Turn space into a Combat space",
  revealPersuasion: 0,
  revealSwords: 0,
  revealAbility: "· +1 Water\n· +1 Spice\n· +1 Troop",
  factionAffiliation: "guild",
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
    // Draw a card AND Turn space into a Combat space
    deckEngine.drawCards(game, player, 1)
    // Mark current space as combat for this turn
    if (game.state.turnTracking) {
      game.state.turnTracking.spaceIsCombat = true
    }
  },

  onAcquire(game, player, card, { resolveEffect }) {
    resolveEffect(game, player, { type: 'troop', amount: 3 }, null, card.name)
  },

}
