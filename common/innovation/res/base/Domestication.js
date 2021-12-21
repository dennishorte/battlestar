const CardBase = require('../CardBase.js')

function Card() {
  this.name = 'Domestication'
  this.color = 'yellow'
  this.age = 1
  this.icons = 'kchk'
  this.dogmaIcon = 'k'
  this.dogma = [
    "Meld the lowest card in your hand. Draw a {1}."
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
