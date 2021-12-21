const CardBase = require('../CardBase.js')

function Card() {
  this.name = 'Clothing'
  this.color = 'green'
  this.age = 1
  this.icons = 'hcll'
  this.dogmaIcon = 'l'
  this.dogma = [
    "Meld a card from your hand of a different color from any card on your board.",
    "Draw and score a {1} for each color present on your board not present on any opponent's board."
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
