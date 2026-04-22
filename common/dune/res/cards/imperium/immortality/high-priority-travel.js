'use strict'

const deckEngine = require('../../../../systems/deckEngine.js')
module.exports = {
  id: "high-priority-travel",
  name: "High Priority Travel",
  source: "Immortality",
  compatibility: "All",
  count: 2,
  persuasionCost: 1,
  acquisitionBonus: null,
  passiveAbility: null,
  agentIcons: [
    "green",
    "yellow"
  ],
  factionAccess: [],
  spyAccess: false,
  agentAbility: "With 2 Influence with Spacing Guild:\n· Draw a card\n  OR\n· Turn space into a Combat space",
  revealPersuasion: 1,
  revealSwords: 0,
  revealAbility: "+1 Solari",
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
    // With 2 Guild Influence: Draw a card OR Turn space into Combat space
    if (player.getInfluence('guild') >= 2) {
      const choices = ['Draw a card', 'Turn space into a Combat space']
      const [choice] = game.actions.choose(player, choices, { title: 'High Priority Travel' })
      if (choice.includes('Draw')) {
        deckEngine.drawCards(game, player, 1)
      }
      else if (game.state.turnTracking) {
        game.state.turnTracking.spaceIsCombat = true
      }
    }
  },

}
