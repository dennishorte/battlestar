const CardBase = require('../CardBase.js')

function Card() {
  this.name = 'Flight'
  this.color = 'red'
  this.age = 8
  this.icons = 'chic'
  this.dogmaIcon = 'c'
  this.dogma = [
    "If your red cards are splayed up, you may splay any one color of your cards up.",
    "You may splay your red cards up."
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
