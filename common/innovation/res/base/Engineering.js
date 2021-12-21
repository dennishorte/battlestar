const CardBase = require('../CardBase.js')

function Card() {
  this.name = 'Engineering'
  this.color = 'red'
  this.age = 3
  this.icons = 'khsk'
  this.dogmaIcon = 'k'
  this.dogma = [
    "I demand you transfer all top cards with a {k} from your board to my score pile!",
    "You may splay your red cards left."
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
