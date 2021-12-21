const CardBase = require('../CardBase.js')

function Card() {
  this.name = 'Printing Press'
  this.color = 'blue'
  this.age = 4
  this.icons = 'hssc'
  this.dogmaIcon = 's'
  this.dogma = [
    "You may return a card from your score pile. If you do, draw a card of value two higher than the top purple card on your board.",
    "You may splay your blue cards right."
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
