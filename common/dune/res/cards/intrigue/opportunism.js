'use strict'

const factions = require('../../../systems/factions.js')
const constants = require('../../constants.js')
module.exports = {
  id: "opportunism",
  name: "Opportunism",
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
  vpsAvailable: 1,
  combatEffect: null,
  endgameEffect: null,
  plotText: "Lose 1 Influence with 2 Factions of your choice and pay 2 Solari → +1 Victory Point",

  plotEffect(game, player) {
    if (player.solari >= 2) {
      const loseFactions = constants.FACTIONS.filter(f => player.getInfluence(f) > 0)
      if (loseFactions.length >= 2) {
        const choices = [
          game.actions.option({ id: 'pass', title: 'Pass' }),
          game.actions.option({ id: 'pay', title: 'Lose 1 Influence with 2 Factions + 2 Solari -> +1 VP' }),
        ]
        const [choice] = game.actions.choose(player, choices, { title: 'Opportunism' })
        const chId = typeof choice === 'object' ? choice.id : choice
        if (chId !== 'pass' && choice !== 'Pass') {
          for (let i = 0; i < 2; i++) {
            const available = constants.FACTIONS
              .filter(f => player.getInfluence(f) > 0)
              .map(f => game.actions.option({ id: f, title: f, kind: 'faction' }))
            const [fChoice] = game.actions.choose(player, available, { title: `Lose Influence (${i + 1}/2)` })
            const faction = typeof fChoice === 'object' ? fChoice.id : fChoice
            factions.loseInfluence(game, player, faction, 1)
          }
          player.decrementCounter('solari', 2)
          player.incrementCounter('vp', 1, { silent: true, source: 'Opportunism (intrigue)' })
          game.log.add({ template: '{player}: +1 VP', args: { player } })
        }
      }
    }
  },

}
