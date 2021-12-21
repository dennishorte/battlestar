const CardBase = require('../CardBase.js')

function Card() {
  this.name = 'Experimentation'
  this.color = 'blue'
  this.age = 4
  this.icons = 'hsss'
  this.dogmaIcon = 's'
  this.dogma = [
    "Draw and meld a 5."
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
