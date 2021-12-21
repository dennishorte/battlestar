const CardBase = require('../CardBase.js')

function Card() {
  this.name = 'Steam Engine'
  this.color = 'yellow'
  this.age = 5
  this.icons = 'hfcf'
  this.dogmaIcon = 'f'
  this.dogma = [
    "Draw and tuck two {4}, then score your bottom yellow card."
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
