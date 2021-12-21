const CardBase = require('../CardBase.js')

function Card() {
  this.name = 'Satellites'
  this.color = 'green'
  this.age = 9
  this.icons = 'hiii'
  this.dogmaIcon = 'i'
  this.dogma = [
    "Return all cards from your hand, and draw three {8}.",
    "You may splay your purple cards up.",
    "Meld a card from your hand and then execute each of its non-demand dogma effects. Do not share them."
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
