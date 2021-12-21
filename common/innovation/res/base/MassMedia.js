const CardBase = require('../CardBase.js')

function Card() {
  this.name = 'Mass Media'
  this.color = 'green'
  this.age = 8
  this.icons = 'shis'
  this.dogmaIcon = 's'
  this.dogma = [
    "You may return a card from your hand. If you do, choose a value and return all cards of that value from all score piles.",
    "You may splay your purple cards up."
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
