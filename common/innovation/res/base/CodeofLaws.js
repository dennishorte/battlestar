const CardBase = require('../CardBase.js')

function Card() {
  this.name = 'Code of Laws'
  this.color = 'purple'
  this.age = 1
  this.icons = 'hccl'
  this.dogmaIcon = 'c'
  this.dogma = [
    "You may tuck a card from your hand of the same color as any card on your board. If you do, you may splay that color of your cards left."
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
