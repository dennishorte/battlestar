const CardBase = require('../CardBase.js')

function Card() {
  this.name = 'City States'
  this.color = 'purple'
  this.age = 1
  this.icons = 'hcck'
  this.dogmaIcon = 'c'
  this.dogma = [
    "I demand you transfer a top card with a {k} from your board to my board if you have at least four {k} on your board! If you do, draw a {1}."
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
