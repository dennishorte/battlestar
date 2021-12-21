const CardBase = require('../CardBase.js')

function Card() {
  this.name = 'Bioengineering'
  this.color = 'blue'
  this.age = 10
  this.icons = 'siih'
  this.dogmaIcon = 'i'
  this.dogma = [
    "Transfer a top card with a {l} from any opponent's board to your score pile.",
    "If any player has fewer than three {l} on their board, the player with the most {l} on their board wins."
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
