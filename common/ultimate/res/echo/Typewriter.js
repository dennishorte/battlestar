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
    `Return all cards from your hand. Draw a {6}. For each color of card returned, draw a card of value one higher than the highest card in your hand.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const returned = game.actions.returnMany(player, game.cards.byPlayer(player, 'hand'))
      const firstAge = game.getEffectAge(self, 6)
      game.actions.draw(player, { age: firstAge })
      const colors = util.array.distinct(returned.map(card => card.color))
      for (let i = 0; i < colors.length; i++) {
        const hand = game.cards.byPlayer(player, 'hand')
        const age = game.util.highestCards(hand)[0].getAge() + 1
        game.actions.draw(player, { age })
      }
    }
  ],
  echoImpl: [],
}
