const CardBase = require('../CardBase.js')

function Card() {
  this.name = 'Bicycle'
  this.color = 'green'
  this.age = 7
  this.icons = 'ccih'
  this.dogmaIcon = 'c'
  this.dogma = [
    "You may exchange all the cards in your hand with all the cards in your score ile. If you exchange one, you must exchange them all."
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
