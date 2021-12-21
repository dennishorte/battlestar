const CardBase = require('../CardBase.js')

function Card() {
  this.name = 'Machine Tools'
  this.color = 'red'
  this.age = 6
  this.icons = 'ffhf'
  this.dogmaIcon = 'f'
  this.dogma = [
    "Draw and score a card of value equal to the highest card in your score pile."
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
