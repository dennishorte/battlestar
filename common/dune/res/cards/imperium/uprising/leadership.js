'use strict'

const deckEngine = require('../../../../systems/deckEngine.js')
module.exports = {
  id: "leadership",
  name: "Leadership",
  source: "Uprising",
  compatibility: "Uprising",
  count: 1,
  persuasionCost: 5,
  acquisitionBonus: null,
  passiveAbility: null,
  agentIcons: [
    "yellow"
  ],
  factionAccess: [
    "fremen"
  ],
  spyAccess: false,
  agentAbility: "For each Sandworm you have in the conflict:\n· Draw a card",
  revealPersuasion: 2,
  revealSwords: 1,
  revealAbility: "+1 Sword for each revealed card that provides one or more Swords this turn",
  factionAffiliation: "fremen",
  vpsAvailable: 0,
  hasTech: false,
  hasShipping: false,
  hasUnload: false,
  hasInfiltration: false,
  hasResearch: false,
  hasGrafting: false,
  hasSpies: false,
  hasSandworms: true,
  hasContracts: false,
  hasBattleIcons: false,
  hasSardaukar: false,

  agentEffect(game, player) {
    // For each Sandworm you have in the conflict: Draw a card.
    const sandworms = game.state.conflict.deployedSandworms[player.name] || 0
    if (sandworms > 0) {
      deckEngine.drawCards(game, player, sandworms)
      game.log.add({ template: '{player} draws {count} cards (Sandworm synergy)', args: { player, count: sandworms } })
    }
  },

}
