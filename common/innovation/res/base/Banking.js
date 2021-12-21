const CardBase = require('../CardBase.js')

function Card() {
  this.name = 'Banking'
  this.color = 'green'
  this.age = 5
  this.icons = 'fchc'
  this.dogmaIcon = 'c'
  this.dogma = [
    "I demand you transfer a top non-green card with a {f} from your board to my board. If you do, draw and score a {5}.",
    "You may splay your green cards right."
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
