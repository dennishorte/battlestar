const CardBase = require('../CardBase.js')

function Card() {
  this.name = 'Databases'
  this.color = 'green'
  this.age = 10
  this.icons = 'hiii'
  this.dogmaIcon = 'i'
  this.dogma = [
    "I demand you return half (rounded up) of the cards in your score pile."
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
