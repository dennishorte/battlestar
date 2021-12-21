const CardBase = require('../CardBase.js')

function Card() {
  this.name = 'Computers'
  this.color = 'blue'
  this.age = 9
  this.icons = 'ihif'
  this.dogmaIcon = 'i'
  this.dogma = [
    "You may splay your red or green cards up.",
    "Draw and meld a {0}, then execute each of its non-demand dogma effects. Do not share them."
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
