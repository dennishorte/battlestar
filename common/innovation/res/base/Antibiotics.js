const CardBase = require('../CardBase.js')

function Card() {
  this.name = 'Antibiotics'
  this.color = 'yellow'
  this.age = 8
  this.icons = 'lllh'
  this.dogmaIcon = 'l'
  this.dogma = [
    "You may return up to three cards from your hand. For every different value of card that you returned, draw two {8}."
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
