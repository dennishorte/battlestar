
const util = require('../../../lib/util.js')

module.exports = {
  name: `Magnifying Glass`,
  color: `blue`,
  age: 3,
  expansion: `echo`,
  biscuits: `sh3&`,
  dogmaBiscuit: `s`,
  echo: [`Draw a {4}, then return a card from your hand.`],
  dogma: [
    `You may return three cards of equal value from your hand. If you do, draw a card of value two higher than the cards you returned.`,
    `You may splay your yellow or blue cards left.`
  ],
  dogmaImpl: [
    (game, player) => {
      const hand = game.getCardsByZone(player, 'hand')
      const groups = util.array.groupBy(hand, card => card.getAge())

      const choices = Object
        .entries(groups)
        .filter(([, cards]) => cards.length >= 3)
        .map(([age,]) => parseInt(age))
        .sort()

      const age = game.aChooseAge(player, choices, {
        title: 'Choose a value to return three cards',
        min: 0,
        max: 1,
      })

      if (age) {
        const choices = hand
          .filter(card => card.getAge() === age)
        const returned = game.aChooseAndReturn(player, choices, { count: 3 })
        if (returned && returned.length === 3) {
          game.aDraw(player, { age: age + 2 })
        }
      }
    },

    (game, player) => {
      game.aChooseAndSplay(player, ['yellow', 'blue'], 'left')
    },
  ],
  echoImpl: [
    (game, player) => {
      game.aDraw(player, { age: game.getEffectAge(this, 4) })
      game.aChooseAndReturn(player, game.getCardsByZone(player, 'hand'))
    }
  ],
}
