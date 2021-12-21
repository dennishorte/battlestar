const CardBase = require('../CardBase.js')

function Card() {
  this.name = 'Robotics'
  this.color = 'red'
  this.age = 10
  this.icons = 'hfif'
  this.dogmaIcon = 'f'
  this.dogma = [
    "Score your top green card. Draw and meld a {0}, then execute each of its non-demand dogma effects. Do not share them."
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
