const CardBase = require('../CardBase.js')

function Card() {
  this.name = 'Sailing'
  this.color = 'green'
  this.age = 1
  this.icons = 'cchl'
  this.dogmaIcon = 'c'
  this.dogma = [
    "Draw and meld a {1}."
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
