const CardBase = require('../CardBase.js')

function Card() {
  this.name = 'Education'
  this.color = 'purple'
  this.age = 3
  this.icons = 'sssh'
  this.dogmaIcon = 's'
  this.dogma = [
    "You may return the highest card from your score pile. If you do, draw a card of value two higher than the highest card remaining in your score pile."
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
