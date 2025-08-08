
const util = require('../../../lib/util.js')

module.exports = {
  name: `Typewriter`,
  color: `blue`,
  age: 7,
  expansion: `echo`,
  biscuits: `shcc`,
  dogmaBiscuit: `c`,
  echo: ``,
  dogma: [
    `Return all cards from your hand. Draw a {6}. For each color of card returned, draw a card of the next higher value.`
  ],
  dogmaImpl: [
    (game, player) => {
      const returned = game.aReturnMany(player, game.getCardsByZone(player, 'hand'))
      const firstAge = game.getEffectAge(this, 6)
      game.aDraw(player, { age: firstAge })
      const colors = util.array.distinct(returned.map(card => card.color))
      for (let i = 0; i < colors.length; i++) {
        game.aDraw(player, { age: firstAge + 1 + i })
      }
    }
  ],
  echoImpl: [],
}
