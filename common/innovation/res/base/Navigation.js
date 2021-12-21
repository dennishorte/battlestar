const CardBase = require('../CardBase.js')

function Card() {
  this.name = 'Navigation'
  this.color = 'green'
  this.age = 4
  this.icons = 'hccc'
  this.dogmaIcon = 'c'
  this.dogma = [
    "I demand you transfer a {2} or {3} from your score pile, if it has any, to my score pile."
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
