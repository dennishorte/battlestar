const CardBase = require('../CardBase.js')

function Card() {
  this.name = 'Genetics'
  this.color = 'blue'
  this.age = 9
  this.icons = 'sssh'
  this.dogmaIcon = 's'
  this.dogma = [
    "Draw and meld a {10}. Score all cards beneath it."
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
