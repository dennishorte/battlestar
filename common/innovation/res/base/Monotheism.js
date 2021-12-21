const CardBase = require('../CardBase.js')

function Card() {
  this.name = 'Monotheism'
  this.color = 'purple'
  this.age = 2
  this.icons = 'hkkk'
  this.dogmaIcon = 'k'
  this.dogma = [
    "I demand you transfer a top card on your board of a different color from any card on my board to my score pile! If you do, draw and tuck a {1}.",
    "Draw and tuck a {1}."
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
