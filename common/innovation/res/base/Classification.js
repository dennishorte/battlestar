const CardBase = require('../CardBase.js')

function Card() {
  this.name = 'Classification'
  this.color = 'green'
  this.age = 6
  this.icons = 'sssh'
  this.dogmaIcon = 's'
  this.dogma = [
    "Reveal the color of a card from your hand. Take into your hand all cards of that color from all opponent's hands. Then, meld all cards of that color from your hand."
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
