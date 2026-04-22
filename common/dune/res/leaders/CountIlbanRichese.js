'use strict'

const deckEngine = require('../../systems/deckEngine.js')

module.exports = {
  name: 'Count Ilban Richese',
  source: 'Base',
  compatibility: 'All',
  house: 'Richese',
  startingEffect: null,
  leaderAbility: 'Ruthless Negotiator\nWhen you pay Solari for the cost of a board space:\n· Draw 1 card',
  signetRingAbility: 'Manufacturing\n· +1 Solari',
  complexity: 1,

  onPaySolariForSpace(game, player) {
    deckEngine.drawCards(game, player, 1)
    game.log.add({
      template: '{player}: Ruthless Negotiator — draws 1 card',
      args: { player },
    })
  },
}
