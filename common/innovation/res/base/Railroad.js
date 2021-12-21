const CardBase = require('../CardBase.js')

function Card() {
  this.name = 'Railroad'
  this.color = 'purple'
  this.age = 7
  this.icons = 'ifih'
  this.dogmaIcon = 'i'
  this.dogma = [
    "Return all cards from your hand, then draw three {6}.",
    "You may splay up any one color of your cards current splayed right."
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
