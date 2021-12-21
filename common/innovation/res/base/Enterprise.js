const CardBase = require('../CardBase.js')

function Card() {
  this.name = 'Enterprise'
  this.color = 'purple'
  this.age = 4
  this.icons = 'hccc'
  this.dogmaIcon = 'c'
  this.dogma = [
    "I demand you transfer a top non-purple card with a {c} from your board to my board. If you do, draw and meld a {4}.",
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
