'use strict'

const factions = require('../../../systems/factions.js')
const constants = require('../../constants.js')
const { addStrength } = require('../../../systems/strengthBreakdown.js')

module.exports = {
  id: "questionable-methods",
  name: "Questionable Methods",
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
  plotEffect: null,
  endgameEffect: null,
  combatText: "+1 Sword; Lose 1 Influence → +4 Swords",

  combatEffect(game, player) {
    addStrength(game, player, 'intrigue', 'Questionable Methods', 1 * constants.SWORD_STRENGTH)
    const loseFactions = constants.FACTIONS.filter(f => player.getInfluence(f) > 0)
    if (loseFactions.length > 0) {
      const choices = ['Pass', ...loseFactions.map(f => `Lose 1 ${f} for +4 Swords`)]
      const [choice] = game.actions.choose(player, choices, { title: 'Questionable Methods' })
      if (choice !== 'Pass') {
        const faction = loseFactions.find(f => choice.includes(f))
        factions.loseInfluence(game, player, faction, 1)
        addStrength(game, player, 'intrigue', 'Questionable Methods', 4 * constants.SWORD_STRENGTH)
      }
    }
  },

}
