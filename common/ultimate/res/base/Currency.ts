
import util from '../../../lib/util.js'


export default {
  name: `Currency`,
  color: `green`,
  age: 2,
  expansion: `base`,
  biscuits: `lchc`,
  dogmaBiscuit: `c`,
  dogma: [
    `You may return any number of cards from your hand. If you do, draw and score a {2} for every different value of card you returned.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const hand = game.cards.byPlayer(player, 'hand')
      const cards = game.actions.chooseAndReturn(player, hand, { min: 0, max: hand.length })

      const toScore = util.array.distinct(cards.map(card => card.getAge())).length
      for (let i = 0; i < toScore; i++) {
        game.actions.drawAndScore(player, game.getEffectAge(self, 2))
      }
    }
  ],
}
