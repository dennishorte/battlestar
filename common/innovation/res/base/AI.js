const CardBase = require('../CardBase.js')

function Card() {
  this.name = 'A.I.'
  this.color = 'purple'
  this.age = 10
  this.icons = 'ssih'
  this.dogmaIcon = 's'
  this.dogma = [
    "Draw and score a {0}.",
    "If Robotics and Software are top cards on any board, the single player with the lowest score wins."
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
