const CardBase = require('../CardBase.js')

function Card() {
  this.name = 'Suburbia'
  this.color = 'yellow'
  this.age = 9
  this.icons = 'hcll'
  this.dogmaIcon = 'l'
  this.dogma = [
    "You may tuck any number of cards from your hand. Draw and score a {1} for each card you tucked."
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
