const CardBase = require('../CardBase.js')

function Card() {
  this.name = 'Machinery'
  this.color = 'yellow'
  this.age = 3
  this.icons = 'llhk'
  this.dogmaIcon = 'l'
  this.dogma = [
    "I demand you exchange all the cards in your hand with all the highest cards in my hand!",
    "Score a card from your hand with a {k}. You may splay your red cards left."
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
