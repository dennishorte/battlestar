const CardBase = require('../CardBase.js')

function Card() {
  this.name = 'Skyscrapers'
  this.color = 'yellow'
  this.age = 8
  this.icons = 'hfcc'
  this.dogmaIcon = 'c'
  this.dogma = [
    "I demand you transfer a top non-yellow card with a {i} from your board to my board! If you do, score the card beneath it, and return all other cards from that pile!"
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
