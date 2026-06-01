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
  plotText: "Lose a Troop → Gain one Influence with a Faction whose board space you sent an Agent to this turn",

  plotEffect(game, player) {
    if (player.troopsInGarrison > 0) {
      player.decrementCounter('troopsInGarrison', 1, { silent: true })
      const fc = constants.FACTIONS.map(f => game.actions.option({ id: f, title: f, kind: 'faction' }))
      const [fChoice] = game.actions.choose(player, fc, { title: '+1 Influence' })
      const faction = typeof fChoice === 'object' ? fChoice.id : fChoice
      factions.gainInfluence(game, player, faction)
    }
  },

}
