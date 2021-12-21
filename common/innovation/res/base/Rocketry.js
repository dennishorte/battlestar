const CardBase = require('../CardBase.js')

function Card() {
  this.name = 'Rocketry'
  this.color = 'blue'
  this.age = 8
  this.icons = 'iiih'
  this.dogmaIcon = 'i'
  this.dogma = [
    "Return a card in any opponent's score pile for every two {i} on your board."
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
