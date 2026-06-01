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
      const choices = [
        game.actions.option({ id: 'pass', title: 'Pass' }),
        ...loseFactions.map(f => game.actions.option({
          id: `lose-${f}`,
          title: `Lose 1 ${f} for +4 Swords`,
          kind: 'faction',
        })),
      ]
      const [choice] = game.actions.choose(player, choices, { title: 'Questionable Methods' })
      const chId = typeof choice === 'object' ? choice.id : choice
      if (chId !== 'pass' && choice !== 'Pass') {
        const faction = chId.startsWith('lose-')
          ? chId.slice('lose-'.length)
          : loseFactions.find(f => (typeof choice === 'string' ? choice : choice.title).includes(f))
        factions.loseInfluence(game, player, faction, 1)
        addStrength(game, player, 'intrigue', 'Questionable Methods', 4 * constants.SWORD_STRENGTH)
      }
    }
  },

}
