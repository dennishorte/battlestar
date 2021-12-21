const CardBase = require('../CardBase.js')

function Card() {
  this.name = 'Quantum Theory'
  this.color = 'blue'
  this.age = 8
  this.icons = 'iiih'
  this.dogmaIcon = 'i'
  this.dogma = [
    "You may return up to two cards from your hand. If you return two, draw a {0} and then draw and score a {0}."
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
