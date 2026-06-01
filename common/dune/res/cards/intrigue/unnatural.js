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
  plotText: "Trash an Intrigue card → +1 Intrigue card. If you trashed a non-Twisted Intrigue card: +1 Troop",

  plotEffect(game, player) {
    const intrigueZone = game.zones.byId(`${player.name}.intrigue`)
    const cards = intrigueZone.cardlist()
    if (cards.length > 0) {
      const choices = [
        game.actions.option({ id: 'pass', title: 'Pass' }),
        ...cards.map(c => game.actions.cardOption(c, 'intrigue-card')),
      ]
      const [choice] = game.actions.choose(player, choices, { title: 'Trash an Intrigue card?' })
      const chId = typeof choice === 'object' ? choice.id : choice
      if (chId !== 'pass' && choice !== 'Pass') {
        const card = typeof choice === 'object'
          ? cards.find(c => c.id === choice.id)
          : cards.find(c => c.name === choice)
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
