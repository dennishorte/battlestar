const CardBase = require('../CardBase.js')

function Card() {
  this.name = 'Metalworking'
  this.color = 'red'
  this.age = 1
  this.icons = 'kkhk'
  this.dogmaIcon = 'k'
  this.dogma = [
    "Draw and reveal a {1}. If it has a {c}, score it and repeat this dogma effect. Otherwise, keep it."
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
