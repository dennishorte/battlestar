const CardBase = require('../CardBase.js')

function Card() {
  this.name = 'Paper'
  this.color = 'green'
  this.age = 3
  this.icons = 'hssc'
  this.dogmaIcon = 's'
  this.dogma = [
    "You may splay your green or blue cards left.",
    "Draw a {4} for every color you have splayed left."
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
