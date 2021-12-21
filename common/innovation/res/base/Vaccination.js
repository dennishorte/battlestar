const CardBase = require('../CardBase.js')

function Card() {
  this.name = 'Vaccination'
  this.color = 'yellow'
  this.age = 6
  this.icons = 'lflh'
  this.dogmaIcon = 'l'
  this.dogma = [
    "I demand you return all the lowest cards in your score pile! If you returned any, draw and meld a {6}!",
    "If any card was returned as a result of the demand, draw and meld a {7}."
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
