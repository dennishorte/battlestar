const CardBase = require('../CardBase.js')

function Card() {
  this.name = 'Reformation'
  this.color = 'purple'
  this.age = 4
  this.icons = 'llhl'
  this.dogmaIcon = 'l'
  this.dogma = [
    "You may tuck a card from your hand for every two {l} on your board.",
    "You may splay your yellow or purple cards right."
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
