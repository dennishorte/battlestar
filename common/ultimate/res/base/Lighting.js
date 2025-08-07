
const util = require('../../../lib/util.js')


module.exports = {
  name: `Lighting`,
  color: `purple`,
  age: 7,
  expansion: `base`,
  biscuits: `hlil`,
  dogmaBiscuit: `l`,
  dogma: [
    `You may tuck up to three cards from your hand. If you do, draw and score a {7} for every different value of card you tucked.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const cards = game.actions.chooseAndTuck(
        player,
        game.cards.byPlayer(player, 'hand'),
        { min: 0, max: 3},
      )
      if (cards) {
        const ages = util.array.distinct(cards.map(card => card.getAge()))
        for (let i = 0; i < ages.length; i++) {
          game.actions.drawAndScore(player, game.getEffectAge(self, 7))
        }
      }
    }
  ],
}
