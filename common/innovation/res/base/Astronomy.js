const CardBase = require('../CardBase.js')

function Card() {
  this.name = 'Astronomy'
  this.color = 'purple'
  this.age = 5
  this.icons = 'cssh'
  this.dogmaIcon = 's'
  this.dogma = [
    "Draw and reveal a {6}. If the card is green or blue, meld it and repeat this dogma effect.",
    "If all non-purple top cards on your board are value {6} or higher, claim the Universe achievement."
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
