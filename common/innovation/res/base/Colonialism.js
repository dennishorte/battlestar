const CardBase = require('../CardBase.js')

function Card() {
  this.name = 'Colonialism'
  this.color = 'red'
  this.age = 4
  this.icons = 'hfsf'
  this.dogmaIcon = 'f'
  this.dogma = [
    "Draw and tuck a {3}. If it has a {c}, repeat this dogma effect."
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
