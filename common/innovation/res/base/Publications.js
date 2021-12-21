const CardBase = require('../CardBase.js')

function Card() {
  this.name = 'Publications'
  this.color = 'blue'
  this.age = 7
  this.icons = 'hsis'
  this.dogmaIcon = 's'
  this.dogma = [
    "You may rearrange the order of one color of cards on your board.",
    "You may splay your yellow or blue cards up."
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
