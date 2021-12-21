const CardBase = require('../CardBase.js')

function Card() {
  this.name = '{name}'
  this.color = '{color}'
  this.age = {age}
  this.icons = '{icons}'
  this.dogmaIcon = '{dogmaIcon}'
  this.dogma = [
    {dogma}
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
