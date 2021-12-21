const CardBase = require('../CardBase.js')

function Card() {
  this.name = 'Coal'
  this.color = 'red'
  this.age = 5
  this.icons = 'fffh'
  this.dogmaIcon = 'f'
  this.dogma = [
    "Draw and tuck a {5}.",
    "You may splay your red cards right.",
    "You may score any one of your top cards. If you do, also score the card beneath it."
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
