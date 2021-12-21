const CardBase = require('../CardBase.js')

function Card() {
  this.name = 'Road Building'
  this.color = 'red'
  this.age = 2
  this.icons = 'kkhk'
  this.dogmaIcon = 'k'
  this.dogma = [
    "Meld one or two cards from your hand. If you melded two, you may transfer your top red card to another player's board. If you do, transfer that player's top green card to your board."
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
