const CardBase = require('../CardBase.js')

function Card() {
  this.name = 'Ecology'
  this.color = 'yellow'
  this.age = 9
  this.icons = 'lssh'
  this.dogmaIcon = 's'
  this.dogma = [
    "You may return a card from your hand. If you do, score a card from your hand and draw two {0}."
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
