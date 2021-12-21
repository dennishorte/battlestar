const CardBase = require('../CardBase.js')

function Card() {
  this.name = 'Pottery'
  this.color = 'blue'
  this.age = 1
  this.icons = 'hlll'
  this.dogmaIcon = 'l'
  this.dogma = [
    "You may return up to three cards from your hand. If you returned any cards, draw and score a card of value equal to the number of cards you returned.",
    "Draw a {1}."
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
