const CardBase = require('../CardBase.js')

function Card() {
  this.name = 'Agriculture'
  this.color = 'yellow'
  this.age = 1
  this.icons = 'hlll'
  this.dogmaIcon = 'l'
  this.dogma = [
    "You may return a card from your hand. If you do, draw and score a ard ofo value one higher than the card you returned."
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
