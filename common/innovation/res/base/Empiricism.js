const CardBase = require('../CardBase.js')

function Card() {
  this.name = 'Empiricism'
  this.color = 'purple'
  this.age = 8
  this.icons = 'sssh'
  this.dogmaIcon = 's'
  this.dogma = [
    "Choose two colors, then draw and reveal a {9}. If it is either of the colors you chose, meld it and your may splay your cards of that color up.",
    "If you have twenty or more {s} on your board, you win."
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
