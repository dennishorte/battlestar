const CardBase = require('../CardBase.js')

function Card() {
  this.name = 'Optics'
  this.color = 'red'
  this.age = 3
  this.icons = 'ccch'
  this.dogmaIcon = 'c'
  this.dogma = [
    "Draw and meld a {3}. If it has a {c}, draw and score a {4}. Otherwise, transfer a card from your score pile to the score pile of an opponent with fewer points than you."
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
