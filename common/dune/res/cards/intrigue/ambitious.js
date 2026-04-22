'use strict'

const factions = require('../../../systems/factions.js')
const constants = require('../../constants.js')
module.exports = {
  id: "ambitious",
  name: "Ambitious",
  source: "Bloodlines",
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
  isTwisted: true,
  vpsAvailable: 0,
  combatEffect: null,
  endgameEffect: null,

  plotEffect(game, player) {
    if (player.troopsInGarrison >= 3) {
      const choices = ['Pass', 'Lose 3 troops for +1 Influence']
      const [choice] = game.actions.choose(player, choices, { title: 'Ambitious' })
      if (choice !== 'Pass') {
        player.decrementCounter('troopsInGarrison', 3, { silent: true })
        const [faction] = game.actions.choose(player, constants.FACTIONS, { title: '+1 Influence with:' })
        factions.gainInfluence(game, player, faction)
      }
    }
  },

}
