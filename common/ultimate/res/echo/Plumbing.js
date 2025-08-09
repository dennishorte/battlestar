
const util = require('../../../lib/util.js')

module.exports = {
  name: `Plumbing`,
  color: `red`,
  age: 1,
  expansion: `echo`,
  biscuits: `&2hk`,
  dogmaBiscuit: `k`,
  echo: `Score the bottom blue card from your board.`,
  dogma: [
    `Junk all cards in the 1 deck.`
  ],
  dogmaImpl: [
    (game, player) => game.aJunkDeck(player, 1)
  ],
  echoImpl: (game, player) => {
    const card = util.array.last(game.cards.byZone(player, 'blue'))
    if (card) {
      game.aScore(player, card)
    }
    else {
      game.mLogNoEffect()
    }
  },
}
