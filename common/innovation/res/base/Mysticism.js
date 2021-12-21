const CardBase = require('../CardBase.js')

function Card() {
  this.name = 'Mysticism'
  this.color = 'purple'
  this.age = 1
  this.icons = 'hkkk'
  this.dogmaIcon = 'k'
  this.dogma = [
    "Draw and reveal a {1}. If it is the same color as any card on your board, meld it and draw a {1}."
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
