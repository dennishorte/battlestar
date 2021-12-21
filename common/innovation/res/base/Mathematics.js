const CardBase = require('../CardBase.js')

function Card() {
  this.name = 'Mathematics'
  this.color = 'blue'
  this.age = 2
  this.icons = 'hscs'
  this.dogmaIcon = 's'
  this.dogma = [
    "You may return a card from your hand. If you do, draw and meld a card of value one higher than the card you returned."
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
