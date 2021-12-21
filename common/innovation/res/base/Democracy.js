const CardBase = require('../CardBase.js')

function Card() {
  this.name = 'Democracy'
  this.color = 'purple'
  this.age = 6
  this.icons = 'cssh'
  this.dogmaIcon = 's'
  this.dogma = [
    "You may return any number of cards from your hand. If you have teturned more cards than any opponent due to Democracy so far during this dogma action, draw and score an {8}."
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
