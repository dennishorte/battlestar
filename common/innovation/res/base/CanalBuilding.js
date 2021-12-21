const CardBase = require('../CardBase.js')

function Card() {
  this.name = 'Canal Building'
  this.color = 'yellow'
  this.age = 2
  this.icons = 'hclc'
  this.dogmaIcon = 'c'
  this.dogma = [
    "You may exchange all the highest cards in your hand with all the highest cards in your score pile."
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
