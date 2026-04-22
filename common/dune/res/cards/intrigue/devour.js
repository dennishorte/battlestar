'use strict'

const deckEngine = require('../../../systems/deckEngine.js')
const constants = require('../../constants.js')
const { addStrength } = require('../../../systems/strengthBreakdown.js')

module.exports = {
  id: "devour",
  name: "Devour",
  source: "Uprising",
  compatibility: "All",
  count: 1,
  hasTech: false,
  hasShipping: false,
  hasResearch: false,
  hasSpies: false,
  hasSandworms: true,
  hasContracts: false,
  hasBattleIcons: false,
  hasSardaukar: false,
  isTwisted: false,
  vpsAvailable: 0,
  plotEffect: null,
  endgameEffect: null,

  combatEffect(game, player) {
    addStrength(game, player, 'intrigue', 'Devour', 2 * constants.SWORD_STRENGTH)
    const sandworms = game.state.conflict.deployedSandworms[player.name] || 0
    if (sandworms > 0) {
      addStrength(game, player, 'intrigue', 'Devour (Sandworm)', 2 * constants.SWORD_STRENGTH)
      // Trash a card
      const handZone = game.zones.byId(`${player.name}.hand`)
      const cards = handZone.cardlist()
      if (cards.length > 0) {
        const [choice] = game.actions.choose(player, cards.map(c => c.name), { title: 'Trash a card' })
        const card = cards.find(c => c.name === choice)
        if (card) {
          deckEngine.trashCard(game, card)
        }
      }
      game.log.add({ template: '{player}: +4 Swords (Sandworm bonus)', args: { player } })
    }
    else {
      game.log.add({ template: '{player}: +2 Swords', args: { player } })
    }
  },

}
