const CardBase = require('../CardBase.js')

function Card() {
  this.name = 'Atomic Theory'
  this.color = 'blue'
  this.age = 6
  this.icons = 'sssh'
  this.dogmaIcon = 's'
  this.dogma = [
    "You may splay your blue cards right.",
    "Draw and meld a {7}."
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
