const CardBase = require('../CardBase.js')

function Card() {
  this.name = 'Tools'
  this.color = 'blue'
  this.age = 1
  this.icons = 'hssk'
  this.dogmaIcon = 's'
  this.dogma = [
    "You may return three cards from your hand. If you do, draw and meld a {3}.",
    "You may return a {3} from your hand. If you do, draw and meld three {1}."
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
