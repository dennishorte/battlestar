'use strict'

module.exports = {
  name: 'Ilesa Ecaz',
  source: 'Rise of Ix',
  compatibility: 'All',
  house: 'Ecaz',
  startingEffect: null,
  leaderAbility: 'One Step Ahead\nRound Start:\n· Set aside a card from your hand\nAt the start of your second turn this round, reveal that card and return it to your hand\nIf you use it to send an Agent this turn:\n· Exactly one Agent icon: +1 Spice\n· Otherwise: +1 Solari',
  signetRingAbility: 'Guild Contacts\nPay 1 Solari:\n· +1 Foldspace card',
  complexity: 3,

  onAssign(game) {
    const deckEngine = require('../../systems/deckEngine.js')
    deckEngine.createFoldspacePile(game)
  },
}
