const CardBase = require('../CardBase.js')

function Card() {
  this.name = 'Canning'
  this.color = 'yellow'
  this.age = 6
  this.icons = 'hflf'
  this.dogmaIcon = 'f'
  this.dogma = [
    "You may draw and tuck a {6}. If you do, score all your top cards without a {6}.",
    "You may splay your yellow cards right."
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
