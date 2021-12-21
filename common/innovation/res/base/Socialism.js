const CardBase = require('../CardBase.js')

function Card() {
  this.name = 'Socialism'
  this.color = 'purple'
  this.age = 8
  this.icons = 'lhll'
  this.dogmaIcon = 'l'
  this.dogma = [
    "You may tuck all cards from your hand. If you tuck one, you must tuck them all. If you tucked at least one purple card, take all the lowest cards in each opponent's hand into your hand."
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
