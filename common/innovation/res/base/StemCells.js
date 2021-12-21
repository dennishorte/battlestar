const CardBase = require('../CardBase.js')

function Card() {
  this.name = 'Stem Cells'
  this.color = 'yellow'
  this.age = 10
  this.icons = 'hlll'
  this.dogmaIcon = 'l'
  this.dogma = [
    "You may score all cards from your hand. If you score one, you must score them all."
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
