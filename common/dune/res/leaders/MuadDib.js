'use strict'

const deckEngine = require('../../systems/deckEngine.js')

module.exports = {
  name: "Muad'Dib",
  source: 'Uprising',
  compatibility: 'Uprising',
  house: 'Atreides',
  startingEffect: null,
  leaderAbility: 'Unpredictable Foe\nReveal Turn: If you have 1+ sandworms in the Conflict:\n· +1 Intrigue',
  signetRingAbility: 'Lead the Way\n· +1 Draw',
  complexity: 1,

  onRevealTurn(game, player) {
    const sandworms = game.state.conflict.deployedSandworms[player.name] || 0
    if (sandworms >= 1) {
      deckEngine.drawIntrigueCard(game, player, 1)
      game.log.add({
        template: '{player}: Unpredictable Foe — +1 Intrigue card',
        args: { player },
      })
    }
  },
}
