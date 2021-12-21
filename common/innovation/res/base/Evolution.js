const CardBase = require('../CardBase.js')

function Card() {
  this.name = 'Evolution'
  this.color = 'blue'
  this.age = 7
  this.icons = 'sssh'
  this.dogmaIcon = 's'
  this.dogma = [
    "You may bhoose to either rdraw and score and {8} and then return a card from your score pile, or draw a card of value one higher than the highest card in your score pile."
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
