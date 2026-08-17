'use strict'

const deckEngine = require('../../../systems/deckEngine.js')
const factions = require('../../../systems/factions.js')
const constants = require('../../constants.js')
const { addStrength } = require('../../../systems/strengthBreakdown.js')

module.exports = {
  id: "tenuous-bond",
  name: "Tenuous Bond",
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
  isTwisted: false,
  vpsAvailable: 0,
  endgameEffect: null,
  plotText: "Lose 1 Influence with any Faction → Gain 1 Influence with any Faction",
  combatText: "Trash a card from your discard pile that costs 1+ Persuasion → +4 Swords",

  plotEffect(game, player) {
    factions.swapInfluence(game, player, { gainTitle: '+1 Influence' })
  },

  combatEffect(game, player) {
    // Trash a card from discard that costs 1+ Persuasion -> +4 Swords
    const discardZone = game.zones.byId(`${player.name}.discard`)
    const trashable = discardZone.cardlist().filter(c => c.persuasionCost > 0)
    if (trashable.length > 0) {
      const choices = [
        game.actions.option({ id: 'pass', title: 'Pass' }),
        ...trashable.map(c => game.actions.cardOption(c, 'imperium-card')),
      ]
      const [choice] = game.actions.choose(player, choices, { title: 'Trash from discard for +4 Swords?' })
      const chId = typeof choice === 'object' ? choice.id : choice
      if (chId !== 'pass' && choice !== 'Pass') {
        const card = typeof choice === 'object'
          ? trashable.find(c => c.id === choice.id)
          : trashable.find(c => c.name === choice)
        if (card) {
          deckEngine.trashCard(game, card)
          addStrength(game, player, 'card', 'Tenuous Bond', 4 * constants.SWORD_STRENGTH)
        }
      }
    }
  },

}
