'use strict'

const deckEngine = require('../../../systems/deckEngine.js')
const constants = require('../../constants.js')
module.exports = {
  id: "discerning",
  name: "Discerning",
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

  plotEffect(game, player) {
    const handZone = game.zones.byId(`${player.name}.hand`)
    const hasAlliance = constants.FACTIONS.some(f => game.state.alliances[f] === player.name)
    if (hasAlliance) {
      deckEngine.drawCards(game, player, 1)
    }
    else if (handZone.cardlist().length > 0) {
      const cards = handZone.cardlist()
      const [choice] = game.actions.choose(player, cards.map(c => c.name), { title: 'Discard a card to draw' })
      const card = cards.find(c => c.name === choice)
      if (card) {
        deckEngine.discardCard(game, player, card)
        deckEngine.drawCards(game, player, 1)
      }
    }
  },

}
