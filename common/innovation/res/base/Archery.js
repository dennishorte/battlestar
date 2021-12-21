const CardBase = require('../CardBase.js')

function Card() {
  this.name = 'Archery'
  this.color = 'red'
  this.age = 1
  this.icons = 'kshk'
  this.dogmaIcon = 'k'
  this.dogma = [
    "I demand you draw a {1}, then transfer the highest card in your hand to my hand!"
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
