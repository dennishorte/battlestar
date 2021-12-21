const CardBase = require('../CardBase.js')

function Card() {
  this.name = 'Electricity'
  this.color = 'green'
  this.age = 7
  this.icons = 'sfhf'
  this.dogmaIcon = 'f'
  this.dogma = [
    "Return all your top cards without a {f}, and then draw an {8} for each card you returned."
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
