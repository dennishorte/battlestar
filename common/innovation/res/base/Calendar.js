const CardBase = require('../CardBase.js')

function Card() {
  this.name = 'Calendar'
  this.color = 'blue'
  this.age = 2
  this.icons = 'hlls'
  this.dogmaIcon = 'l'
  this.dogma = [
    "If you have more cards in your score pile than in your hand, draw two {3}."
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
