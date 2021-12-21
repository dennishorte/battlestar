const CardBase = require('../CardBase.js')

function Card() {
  this.name = 'Lighting'
  this.color = 'purple'
  this.age = 7
  this.icons = 'hlil'
  this.dogmaIcon = 'l'
  this.dogma = [
    "You may tuck up to three cards from your hand. If you do, draw and score a {7} for every different value of card you tucked."
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
