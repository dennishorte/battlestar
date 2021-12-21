const CardBase = require('../CardBase.js')

function Card() {
  this.name = 'Translation'
  this.color = 'blue'
  this.age = 3
  this.icons = 'hccc'
  this.dogmaIcon = 'c'
  this.dogma = [
    "You may meld all the cards in your score pile. If you meld one, you must meld them all.",
    "If each top card on your board has a {c}, claim the World achievement."
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
