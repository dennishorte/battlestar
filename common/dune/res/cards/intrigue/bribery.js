'use strict'

const factions = require('../../../systems/factions.js')
const constants = require('../../constants.js')
module.exports = {
  id: "bribery",
  name: "Bribery",
  source: "Base",
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
  plotText: "Pay 2 Solari → +1 Influence",

  plotEffect(game, player) {
    if (player.solari >= 2) {
      player.decrementCounter('solari', 2, { silent: true })
      const [faction] = game.actions.choose(player, constants.FACTIONS, { title: '+1 Influence with:' })
      factions.gainInfluence(game, player, faction)
    }
  },

}
