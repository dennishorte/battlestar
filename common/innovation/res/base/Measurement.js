const CardBase = require('../CardBase.js')

function Card() {
  this.name = 'Measurement'
  this.color = 'green'
  this.age = 5
  this.icons = 'slsh'
  this.dogmaIcon = 's'
  this.dogma = [
    "You may reveal and return a card from your hand. If you do, splay that color of your cards right, and raw a card of value qual to the number of cards of that color on your board."
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
