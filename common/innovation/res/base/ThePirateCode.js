const CardBase = require('../CardBase.js')

function Card() {
  this.name = 'The Pirate Code'
  this.color = 'red'
  this.age = 5
  this.icons = 'cfch'
  this.dogmaIcon = 'c'
  this.dogma = [
    "I demand you transfer two cards of value {4} or less from your score pile to my score pile!",
    "If any cards were transferred due to the demand, score the lowest top card with a {c} from your board."
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
