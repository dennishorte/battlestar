'use strict'

const deckEngine = require('../../../systems/deckEngine.js')
module.exports = {
  id: "devious",
  name: "Devious",
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
  plotText: "Trash a card from your hand OR Deploy up to 2 troops from your garrison to the Conflict",

  plotEffect(game, player) {
    const choices = []
    const handZone = game.zones.byId(`${player.name}.hand`)
    if (handZone.cardlist().length > 0) {
      choices.push('Trash a card from hand')
    }
    if (player.troopsInGarrison > 0) {
      choices.push('Deploy up to 2 troops')
    }
    choices.push('Pass')
    const [choice] = game.actions.choose(player, choices, { title: 'Devious' })
    if (choice.includes('Trash')) {
      const cards = handZone.cardlist()
      const [tc] = game.actions.choose(player, cards.map(c => c.name), { title: 'Trash which card?' })
      const card = cards.find(c => c.name === tc)
      if (card) {
        deckEngine.trashCard(game, card)
      }
    }
    else if (choice.includes('Deploy')) {
      const max = Math.min(2, player.troopsInGarrison)
      const deployChoices = []
      for (let i = 1; i <= max; i++) {
        deployChoices.push(`Deploy ${i}`)
      }
      const [dc] = game.actions.choose(player, deployChoices, { title: 'How many?' })
      const count = parseInt(dc.match(/\d+/)[0])
      player.decrementCounter('troopsInGarrison', count, { silent: true })
      game.state.conflict.deployedTroops[player.name] = (game.state.conflict.deployedTroops[player.name] || 0) + count
    }
  },

}
