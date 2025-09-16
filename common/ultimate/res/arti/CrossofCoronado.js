const util = require('../../../lib/util.js')

module.exports = {
  name: `Cross of Coronado`,
  color: `purple`,
  age: 4,
  expansion: `arti`,
  biscuits: `cchc`,
  dogmaBiscuit: `c`,
  dogma: [
    `Reveal your hand. If you have exactly five cards and five colors in your hand, you win.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const cards = game.cards.byPlayer(player, 'hand')
      for (const card of cards) {
        game.mReveal(player, card)
      }

      const colors = util.array.distinct(cards.map(card => card.color))
      if (cards.length === 5 && colors.length === 5) {
        game.youWin(player, self.name)
      }
    }
  ],
}
