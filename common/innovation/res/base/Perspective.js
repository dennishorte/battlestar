const CardBase = require('../CardBase.js')

function Card() {
  this.name = 'Perspective'
  this.color = 'yellow'
  this.age = 4
  this.icons = 'hssl'
  this.dogmaIcon = 's'
  this.dogma = [
    "You may return a card from your hand. If you do, score a card from your hand for every two {s} on your board."
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
