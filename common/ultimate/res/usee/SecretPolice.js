const util = require('../../../lib/util.js')

module.exports = {
  name: `Secret Police`,
  color: `yellow`,
  age: 3,
  expansion: `usee`,
  biscuits: `kkkh`,
  dogmaBiscuit: `k`,
  dogma: [
    `I demand you tuck a card in your hand, then return your top card of its color! If you do, repeat this effect! Otherwise, draw a {3}!`,
    `You may tuck any number of cards of any one color from your hand.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      while (true) {
        const tucked = game.aChooseAndTuck(player, game.getCardsByZone(player, 'hand'), { count: 1 })[0]

        if (tucked) {
          game.aReturn(player, game.getTopCard(player, tucked.color))
          continue
        }
        else {
          game.aDraw(player, { age: game.getEffectAge(self, 3) })
          break
        }
      }
    },
    (game, player) => {
      game.aChooseAndTuck(player, game.getCardsByZone(player, 'hand'), {
        title: 'Tuck any number of cards of the same color',
        min: 0,
        max: game.getCardsByZone(player, 'hand').length,
        guard: (cards) => util.array.distinct(cards.map(c => c.color)).length === 1,
      })
    }
  ],
}
