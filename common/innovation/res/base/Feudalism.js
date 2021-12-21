const CardBase = require('../CardBase.js')

function Card() {
  this.name = 'Feudalism'
  this.color = 'purple'
  this.age = 3
  this.icons = 'hklk'
  this.dogmaIcon = 'k'
  this.dogma = [
    "I demand you transfer a card with a {k} from your hand to my hand! If you do, unsplay that color of your cards!",
    "You may splay your yellow or purple cards left."
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
