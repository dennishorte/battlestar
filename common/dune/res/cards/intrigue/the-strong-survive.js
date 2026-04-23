'use strict'

const deckEngine = require('../../../systems/deckEngine.js')
module.exports = {
  id: "the-strong-survive",
  name: "The Strong Survive",
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
  plotEffect: null,
  endgameEffect: null,
  combatText: "+3 Troops OR Retreat one of your troops → Trash a card",

  combatEffect(game, player) {
    const choices = ['+3 Troops']
    const deployed = game.state.conflict.deployedTroops[player.name] || 0
    if (deployed > 0) {
      choices.push('Retreat 1 troop -> Trash a card')
    }
    const [choice] = game.actions.choose(player, choices, { title: 'The Strong Survive' })
    if (choice.includes('+3')) {
      const recruit = Math.min(3, player.troopsInSupply)
      if (recruit > 0) {
        player.decrementCounter('troopsInSupply', recruit, { silent: true })
        player.incrementCounter('troopsInGarrison', recruit, { silent: true })
      }
    }
    else {
      game.state.conflict.deployedTroops[player.name]--
      player.incrementCounter('troopsInSupply', 1, { silent: true })
      const handZone = game.zones.byId(`${player.name}.hand`)
      const cards = handZone.cardlist()
      if (cards.length > 0) {
        const [tc] = game.actions.choose(player, cards.map(c => c.name), { title: 'Trash' })
        const card = cards.find(c => c.name === tc)
        if (card) {
          deckEngine.trashCard(game, card)
        }
      }
    }
  },

}
