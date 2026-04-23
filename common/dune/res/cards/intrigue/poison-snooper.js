'use strict'

const deckEngine = require('../../../systems/deckEngine.js')
module.exports = {
  id: "poison-snooper",
  name: "Poison Snooper",
  source: "Base",
  compatibility: "All",
  count: 2,
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
  plotText: "Look at the top card of your deck, Draw or Trash it",

  plotEffect(game, player) {
    const deckZone = game.zones.byId(`${player.name}.deck`)
    const topCards = deckZone.cardlist()
    if (topCards.length > 0) {
      const topCard = topCards[0]
      const choices = [`Draw ${topCard.name}`, `Trash ${topCard.name}`]
      const [choice] = game.actions.choose(player, choices, { title: 'Poison Snooper: Top card' })
      if (choice.includes('Draw')) {
        const handZone = game.zones.byId(`${player.name}.hand`)
        topCard.moveTo(handZone)
      }
      else {
        deckEngine.trashCard(game, topCard)
      }
    }
  },

}
