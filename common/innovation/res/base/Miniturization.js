const CardBase = require('../CardBase.js')

function Card() {
  this.name = 'Miniturization'
  this.color = 'red'
  this.age = 10
  this.icons = 'hsis'
  this.dogmaIcon = 's'
  this.dogma = [
    "You may return a card from your hand. If you returned a {0}, draw a {0} for every different value of card in your score pile."
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
