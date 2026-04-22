'use strict'

const deckEngine = require('../../systems/deckEngine.js')

module.exports = {
  name: 'Countess Ariana Thorvald',
  source: 'Base',
  compatibility: 'All',
  house: 'Thorvald',
  startingEffect: null,
  leaderAbility: 'Spice Addict\nWhen you harvest spice:\n· Gain 1 less spice\n· Draw 1 card',
  signetRingAbility: 'Hidden Reservoir\n· +1 Water',
  complexity: 3,

  modifyHarvestAmount(game, player, total) {
    if (total <= 0) {
      return total
    }
    deckEngine.drawCards(game, player, 1)
    game.log.add({
      template: '{player}: Spice Addict — draws 1 card, harvests 1 less Spice',
      args: { player },
    })
    return Math.max(0, total - 1)
  },
}
