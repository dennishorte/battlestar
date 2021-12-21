const CardBase = require('../CardBase.js')

function Card() {
  this.name = 'Encyclopedia'
  this.color = 'blue'
  this.age = 6
  this.icons = 'hccc'
  this.dogmaIcon = 'c'
  this.dogma = [
    "You may meld all the highest cards in your score pile. If you meld one of the highest, you must meld all of the highest."
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
