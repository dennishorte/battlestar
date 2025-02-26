const CardBase = require(`../CardBase.js`)
const util = require('../../../lib/util.js')

function Card() {
  this.id = `Typewriter`  // Card names are unique in Innovation
  this.name = `Typewriter`
  this.color = `blue`
  this.age = 7
  this.expansion = `echo`
  this.biscuits = `shcc`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Return all cards from your hand. Draw a {6}. For each color of card returned, draw a card of the next higher value.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const returned = game.aReturnMany(player, game.getCardsByZone(player, 'hand'))
      const firstAge = game.getEffectAge(this, 6)
      game.aDraw(player, { age: firstAge })
      const colors = util.array.distinct(returned.map(card => card.color))
      for (let i = 0; i < colors.length; i++) {
        game.aDraw(player, { age: firstAge + 1 + i })
      }
    }
  ]
  this.echoImpl = []
  this.inspireImpl = []
  this.karmaImpl = []
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
