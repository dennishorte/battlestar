
const util = require('../../../lib/util.js')


module.exports = {
  name: `Antibiotics`,
  color: `yellow`,
  age: 8,
  expansion: `base`,
  biscuits: `lllh`,
  dogmaBiscuit: `l`,
  dogma: [
    `You may return up to three cards from your hand. For every different value of card that you returned, draw two {8}.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const hand = game.zones.byPlayer(player, 'hand').cards()
      const cards = game.aChooseAndReturn(player, hand, { min: 0, max: 3 })

      if (cards) {
        const numValues = util.array.distinct(cards.map(c => c.getAge())).length
        for (let i = 0; i < numValues; i++) {
          game.aDraw(player, { age: game.getEffectAge(self, 8) })
          game.aDraw(player, { age: game.getEffectAge(self, 8) })
        }
      }
    }
  ],
}
