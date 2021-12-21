const CardBase = require('../CardBase.js')

function Card() {
  this.name = 'Writing'
  this.color = 'blue'
  this.age = 1
  this.icons = 'hssc'
  this.dogmaIcon = 's'
  this.dogma = [
    "Draw a {2}."
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
