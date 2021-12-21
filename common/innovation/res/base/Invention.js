const CardBase = require('../CardBase.js')

function Card() {
  this.name = 'Invention'
  this.color = 'green'
  this.age = 4
  this.icons = 'hssf'
  this.dogmaIcon = 's'
  this.dogma = [
    "You may splay right any one color of your cards currently splayed left. If you do, draw and score a {4}.",
    "If you have five colors splayed, each in any direction, claim the Wonder achievement."
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
