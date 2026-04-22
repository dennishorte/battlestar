'use strict'

const deckEngine = require('../../../../systems/deckEngine.js')
module.exports = {
  id: "show-of-strength",
  name: "Show of Strength",
  source: "Immortality",
  compatibility: "All",
  count: 1,
  persuasionCost: 3,
  acquisitionBonus: null,
  passiveAbility: null,
  agentIcons: [],
  factionAccess: [],
  spyAccess: false,
  agentAbility: "If you have more deployed troops than each opponent, this has Green and Yellow access\n· Draw two cards",
  revealPersuasion: 1,
  revealSwords: 2,
  revealAbility: null,
  factionAffiliation: "emperor",
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
    // If more deployed troops than each opponent: Draw 2 cards. (access handled elsewhere)
    const myTroops = game.state.conflict.deployedTroops[player.name] || 0
    const hasMore = game.players.all().every(p =>
      p.name === player.name || (game.state.conflict.deployedTroops[p.name] || 0) < myTroops
    )
    if (hasMore && myTroops > 0) {
      deckEngine.drawCards(game, player, 2)
    }
  },

}
