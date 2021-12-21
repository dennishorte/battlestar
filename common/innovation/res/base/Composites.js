const CardBase = require('../CardBase.js')

function Card() {
  this.name = 'Composites'
  this.color = 'red'
  this.age = 9
  this.icons = 'ffhf'
  this.dogmaIcon = 'f'
  this.dogma = [
    "I demand you transfer all but one card from your hand to my hand! Also, transfer the highest card from your score pile to my score pile!"
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
