const CardBase = require('../CardBase.js')

function Card() {
  this.name = 'Explosives'
  this.color = 'red'
  this.age = 7
  this.icons = 'hfff'
  this.dogmaIcon = 'f'
  this.dogma = [
    "I demand you transfer the three highest cards from your hand to my hand! If you transferred any, and then have no cards in hand, draw a {7}."
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
