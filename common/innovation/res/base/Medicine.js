const CardBase = require('../CardBase.js')

function Card() {
  this.name = 'Medicine'
  this.color = 'yellow'
  this.age = 3
  this.icons = 'cllh'
  this.dogmaIcon = 'l'
  this.dogma = [
    "I demand you exchange the highest card in your score pile with the lowest card in my score pile."
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
