'use strict'

const factions = require('../../../systems/factions.js')
const constants = require('../../constants.js')
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

  plotEffect(game, player) {
    if (player.solari >= 5) {
      player.decrementCounter('solari', 5, { silent: true })
      for (let i = 0; i < 2; i++) {
        const [faction] = game.actions.choose(player, constants.FACTIONS, { title: `+1 Influence (${i + 1}/2)` })
        factions.gainInfluence(game, player, faction)
      }
    }
  },

}
