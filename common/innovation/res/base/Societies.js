const CardBase = require('../CardBase.js')

function Card() {
  this.name = 'Societies'
  this.color = 'purple'
  this.age = 5
  this.icons = 'chsc'
  this.dogmaIcon = 'c'
  this.dogma = [
    "I demand you transfer a card with a {s} higher than my top card of the same color from your board to my board! If you do, draw a {5}!"
  ]
  this.implementation = [
    function(context) {
      throw new Error('not implemented')
    },
  ]
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, 'constructor', {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
