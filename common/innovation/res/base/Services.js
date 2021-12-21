const CardBase = require('../CardBase.js')

function Card() {
  this.name = 'Services'
  this.color = 'purple'
  this.age = 9
  this.icons = 'hlll'
  this.dogmaIcon = 'l'
  this.dogma = [
    "I demand you transfer all the highest cards from your score pile to my hand! If you transferred any cards, then transfer a top card from my board without a {l} to your hand."
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
