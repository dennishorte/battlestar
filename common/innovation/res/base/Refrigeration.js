const CardBase = require('../CardBase.js')

function Card() {
  this.name = 'Refrigeration'
  this.color = 'yellow'
  this.age = 7
  this.icons = 'hllc'
  this.dogmaIcon = 'l'
  this.dogma = [
    "I demand you return half (round down) of the cards in your hand!",
    "You may score a card from your hand."
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
