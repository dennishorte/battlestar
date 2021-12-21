const CardBase = require('../CardBase.js')

function Card() {
  this.name = 'Fermenting'
  this.color = 'yellow'
  this.age = 2
  this.icons = 'llhk'
  this.dogmaIcon = 'l'
  this.dogma = [
    "Draw a {2} for every color on your board with one or more {l}."
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
