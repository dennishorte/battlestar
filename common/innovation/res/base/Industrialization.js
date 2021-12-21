const CardBase = require('../CardBase.js')

function Card() {
  this.name = 'Industrialization'
  this.color = 'red'
  this.age = 6
  this.icons = 'cffh'
  this.dogmaIcon = 'f'
  this.dogma = [
    "Draw and tuck a {6} for every color on your board with one or more {f}.",
    "You may splay your red or purple cards right."
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
