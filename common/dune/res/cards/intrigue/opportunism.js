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
        const choices = ['Pass', 'Lose 1 Influence with 2 Factions + 2 Solari -> +1 VP']
        const [choice] = game.actions.choose(player, choices, { title: 'Opportunism' })
        if (choice !== 'Pass') {
          for (let i = 0; i < 2; i++) {
            const available = constants.FACTIONS.filter(f => player.getInfluence(f) > 0)
            const [faction] = game.actions.choose(player, available, { title: `Lose Influence (${i + 1}/2)` })
            factions.loseInfluence(game, player, faction, 1)
          }
          player.decrementCounter('solari', 2, { silent: true })
          player.gainVp(1, 'Opportunism (intrigue)')
          game.log.add({ template: '{player}: +1 VP', args: { player } })
        }
      }
    }
  },

}
