'use strict'

const factions = require('../../../systems/factions.js')
const constants = require('../../constants.js')
module.exports = {
  id: "finesse",
  name: "Finesse",
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
  combatEffect: "+2 Swords",
  endgameEffect: null,

  plotEffect(game, player) {
    const loseFactions = constants.FACTIONS.filter(f => player.getInfluence(f) > 0)
    if (loseFactions.length > 0) {
      const choices = ['Pass', ...loseFactions.map(f => `Lose 1 ${f}`)]
      const [choice] = game.actions.choose(player, choices, { title: 'Swap influence?' })
      if (choice !== 'Pass') {
        const loseFaction = loseFactions.find(f => choice.includes(f))
        factions.loseInfluence(game, player, loseFaction, 1)
        const [gf] = game.actions.choose(player, constants.FACTIONS, { title: '+1 Influence' })
        factions.gainInfluence(game, player, gf)
      }
    }
  },

}
