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
    (game, player) => game.actions.junkDeck(player, 1)
  ],
  echoImpl: (game, player) => {
    const card = game.cards.byPlayer(player, 'blue').slice(-1)[0]
    if (card) {
      game.actions.score(player, card)
    }
    else {
      game.log.addNoEffect()
    }
  },
}
