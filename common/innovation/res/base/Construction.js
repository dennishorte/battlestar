const CardBase = require('../CardBase.js')

function Card() {
  this.name = 'Construction'
  this.color = 'red'
  this.age = 2
  this.icons = 'khkk'
  this.dogmaIcon = 'k'
  this.dogma = [
    "I demand you transfer two cards from your hand to my hand! Draw a {2}!",
    "If you are the only player with five top cards, claim the Empire achievement."
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
