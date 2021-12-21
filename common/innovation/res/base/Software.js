const CardBase = require('../CardBase.js')

function Card() {
  this.name = 'Software'
  this.color = 'blue'
  this.age = 10
  this.icons = 'iiih'
  this.dogmaIcon = 'i'
  this.dogma = [
    "Draw and score a {0}.",
    "Draw and meld two {0}, then execute each of the second card's non-demand dogma effects. Do not share them."
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
