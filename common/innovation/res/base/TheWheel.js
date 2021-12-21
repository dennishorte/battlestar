const CardBase = require('../CardBase.js')

function Card() {
  this.name = 'The Wheel'
  this.color = 'green'
  this.age = 1
  this.icons = 'hkkk'
  this.dogmaIcon = 'k'
  this.dogma = [
    "Draw two {1}."
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
