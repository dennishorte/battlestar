const CardBase = require('../CardBase.js')

function Card() {
  this.name = 'Sanitation'
  this.color = 'yellow'
  this.age = 7
  this.icons = 'llhl'
  this.dogmaIcon = 'l'
  this.dogma = [
    "I demand you exchange the two highest cards in your hand with the lowest card in my hand!"
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
