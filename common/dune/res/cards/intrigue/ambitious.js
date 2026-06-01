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
  plotText: "Lose three of your troops → Gain one Influence with a Faction where an opponent has more Influence than you",

  plotEffect(game, player) {
    if (player.troopsInGarrison >= 3) {
      const choices = [
        game.actions.option({ id: 'pass', title: 'Pass' }),
        game.actions.option({ id: 'pay', title: 'Lose 3 troops for +1 Influence' }),
      ]
      const [choice] = game.actions.choose(player, choices, { title: 'Ambitious' })
      const chId = typeof choice === 'object' ? choice.id : choice
      if (chId !== 'pass' && choice !== 'Pass') {
        player.decrementCounter('troopsInGarrison', 3, { silent: true })
        const fc = constants.FACTIONS.map(f => game.actions.option({ id: f, title: f, kind: 'faction' }))
        const [fChoice] = game.actions.choose(player, fc, { title: '+1 Influence with:' })
        const faction = typeof fChoice === 'object' ? fChoice.id : fChoice
        factions.gainInfluence(game, player, faction)
      }
    }
  },

}
