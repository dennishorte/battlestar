const util = require('../../../lib/util.js')

module.exports = {
  name: `Freemasons`,
  color: `yellow`,
  age: 3,
  expansion: `usee`,
  biscuits: `chck`,
  dogmaBiscuit: `c`,
  dogma: [
    `For each color, you may tuck a card from your hand of that color. If you tuck any yellow or expansion cards, draw two {3}.`,
    `You may splay your yellow or blue cards left.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const tucked = game.aChooseAndTuck(player, game.getCardsByZone(player, 'hand'), {
        title: 'Choose up to one card of each color',
        min: 0,
        max: 5,
        guard: (cards) => util.array.isDistinct(cards.map(c => c.color)),
      })

      const tuckedYellow = tucked.some(c => c.color === 'yellow')
      const tuckedExpansion = tucked.some(c => c.expansion !== 'base')

      if (tuckedYellow || tuckedExpansion) {
        game.aDraw(player, { age: game.getEffectAge(self, 3) })
        game.aDraw(player, { age: game.getEffectAge(self, 3) })
      }
    },
    (game, player) => {
      game.aChooseAndSplay(player, ['yellow', 'blue'], 'left')
    }
  ],
}
