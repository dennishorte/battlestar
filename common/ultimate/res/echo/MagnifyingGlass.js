const CardBase = require(`../CardBase.js`)
const util = require('../../../lib/util.js')

function Card() {
  this.id = `Magnifying Glass`  // Card names are unique in Innovation
  this.name = `Magnifying Glass`
  this.color = `blue`
  this.age = 3
  this.expansion = `echo`
  this.biscuits = `sh3&`
  this.dogmaBiscuit = `s`
  this.echo = `Draw a {4}, then return a card from your hand.`
  this.karma = []
  this.dogma = [
    `You may return three cards of equal value from your hand. If you do, draw a card of value two higher than the cards you returned.`,
    `You may splay your yellow or blue cards left.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const hand = game.getCardsByZone(player, 'hand')
      const groups = util.array.groupBy(hand, card => card.getAge())

      const choices = Object
        .entries(groups)
        .filter(([_, cards]) => cards.length >= 3)
        .map(([age, _]) => parseInt(age))
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
  ]
  this.echoImpl = (game, player) => {
    game.aDraw(player, { age: game.getEffectAge(this, 4) })
    game.aChooseAndReturn(player, game.getCardsByZone(player, 'hand'))
  }
  this.karmaImpl = []
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
