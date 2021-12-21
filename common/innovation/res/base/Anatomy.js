const CardBase = require('../CardBase.js')

function Card() {
  this.name = 'Anatomy'
  this.color = 'yellow'
  this.age = 4
  this.icons = 'lllh'
  this.dogmaIcon = 'l'
  this.dogma = [
    "I demand you return a card from your score pile! If you do, return a top card of equal value from your board!"
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
