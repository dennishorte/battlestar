import util from '../../../lib/util.js'

export default {
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
        const tucked = game.actions.chooseAndTuck(player, game.cards.byPlayer(player, 'hand'), { count: 1 })[0]

        if (tucked) {
          game.actions.return(player, game.cards.top(player, tucked.color))
          continue
        }
        else {
          game.actions.draw(player, { age: game.getEffectAge(self, 3) })
          break
        }
      }
    },
    (game, player) => {
      game.actions.chooseAndTuck(player, game.cards.byPlayer(player, 'hand'), {
        title: 'Tuck any number of cards of the same color',
        min: 0,
        max: game.cards.byPlayer(player, 'hand').length,
        guard: (cards) => util.array.distinct(cards.map(c => c.color)).length === 1,
      })
    }
  ],
}
