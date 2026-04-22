'use strict'

const deckEngine = require('../../../../systems/deckEngine.js')
module.exports = {
  id: "pivotal-gambit",
  name: "Pivotal Gambit",
  source: "Promo",
  compatibility: "All",
  count: 1,
  persuasionCost: 3,
  acquisitionBonus: null,
  passiveAbility: null,
  agentIcons: [
    "purple"
  ],
  factionAccess: [
    "fremen"
  ],
  spyAccess: false,
  agentAbility: "Trash this card →\n· +1 Troop\n· Add +1 Influence with any Faction to the first place reward for this conflict",
  revealPersuasion: 1,
  revealSwords: 2,
  revealAbility: null,
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

  agentEffect(game, player, card) {
    // Trash this card -> +1 Troop AND add +1 Influence to 1st place conflict reward
    deckEngine.trashCard(game, card)
    const recruit = Math.min(1, player.troopsInSupply)
    if (recruit > 0) {
      player.decrementCounter('troopsInSupply', recruit, { silent: true })
      player.incrementCounter('troopsInGarrison', recruit, { silent: true })
      game.log.add({ template: '{player} recruits 1 troop', args: { player } })
    }
    // Modify first place reward — store as state for combat resolution
    if (!game.state.conflict.bonusFirstPlaceInfluence) {
      game.state.conflict.bonusFirstPlaceInfluence = 0
    }
    game.state.conflict.bonusFirstPlaceInfluence++
    game.log.add({ template: '{player} adds +1 Influence to 1st place reward', args: { player } })
  },

}
