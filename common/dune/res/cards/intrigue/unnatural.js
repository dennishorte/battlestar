'use strict'

const deckEngine = require('../../../systems/deckEngine.js')
module.exports = {
  id: "unnatural",
  name: "Unnatural",
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
    const intrigueZone = game.zones.byId(`${player.name}.intrigue`)
    const cards = intrigueZone.cardlist()
    if (cards.length > 0) {
      const choices = ['Pass', ...cards.map(c => c.name)]
      const [choice] = game.actions.choose(player, choices, { title: 'Trash an Intrigue card?' })
      if (choice !== 'Pass') {
        const card = cards.find(c => c.name === choice)
        if (card) {
          deckEngine.trashCard(game, card)
          deckEngine.drawIntrigueCard(game, player, 1)
          const recruit = Math.min(1, player.troopsInSupply)
          if (recruit > 0) {
            player.decrementCounter('troopsInSupply', recruit, { silent: true })
            player.incrementCounter('troopsInGarrison', recruit, { silent: true })
          }
        }
      }
    }
  },

}
