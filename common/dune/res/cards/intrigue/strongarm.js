'use strict'

const factions = require('../../../systems/factions.js')
const constants = require('../../constants.js')
module.exports = {
  id: "strongarm",
  name: "Strongarm",
  source: "Rise of Ix",
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

  plotEffect(game, player) {
    if (player.troopsInGarrison > 0) {
      player.decrementCounter('troopsInGarrison', 1, { silent: true })
      const [faction] = game.actions.choose(player, constants.FACTIONS, { title: '+1 Influence' })
      factions.gainInfluence(game, player, faction)
    }
  },

}
