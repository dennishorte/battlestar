const CardBase = require('../CardBase.js')

function Card() {
  this.name = 'Philosophy'
  this.color = 'purple'
  this.age = 2
  this.icons = 'hsss'
  this.dogmaIcon = 's'
  this.dogma = [
    "You may splay left any one color of your cards.",
    "You may score a card from your hand."
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
