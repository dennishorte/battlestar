const CardBase = require('../CardBase.js')

function Card() {
  this.name = 'Currency'
  this.color = 'green'
  this.age = 2
  this.icons = 'lchc'
  this.dogmaIcon = 'c'
  this.dogma = [
    "You may return any number of cards from your hand. If you do, draw and score a {2} for every different value of card you returned."
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
