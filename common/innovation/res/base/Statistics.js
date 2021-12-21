const CardBase = require('../CardBase.js')

function Card() {
  this.name = 'Statistics'
  this.color = 'yellow'
  this.age = 5
  this.icons = 'lslh'
  this.dogmaIcon = 'l'
  this.dogma = [
    "I demand you transferr all the highest cards in your score pile to your hand.",
    "You may splay your yellow cards right."
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
