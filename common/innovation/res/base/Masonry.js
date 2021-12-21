const CardBase = require('../CardBase.js')

function Card() {
  this.name = 'Masonry'
  this.color = 'yellow'
  this.age = 1
  this.icons = 'khkk'
  this.dogmaIcon = 'k'
  this.dogma = [
    "You may meld any number of cards from your hand, each with a {k}. If you melded four or more cards in this way, claim the Monument achievement."
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
