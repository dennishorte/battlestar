'use strict'

const factions = require('../../../systems/factions.js')
module.exports = {
  id: "buy-access",
  name: "Buy Access",
  source: "Uprising",
  compatibility: "All",
  count: 1,
  hasTech: false,
  hasShipping: false,
  hasResearch: false,
  hasSpies: false,
  hasSandworms: false,
  hasContracts: false,
  hasBattleIcons: false,
  hasSardaukar: false,
  isTwisted: false,
  vpsAvailable: 0,
  combatEffect: null,
  endgameEffect: null,
  plotText: "Pay 5 Solari → +1 Influence in 2 Factions of your choice",

  plotEffect(game, player) {
    if (player.solari >= 5) {
      player.decrementCounter('solari', 5, { silent: true })
      factions.gainInfluenceWithChoice(game, player, 2, '+1 Influence with 2 Factions')
    }
  },

}
