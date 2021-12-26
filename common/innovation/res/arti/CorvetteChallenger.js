const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Corvette Challenger`
  this.color = `blue`
  this.age = 7
  this.biscuits = `lshl`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.triggers = []
  this.dogma = [
    `Draw and tuck an {8}. Splay up the color of the tucked card. Draw and score a card of value equal to the number of cards of that color visible on your board.`
  ]

  this.dogmaImpl = []
  this.echoImpl = []
  this.inspireImpl = []
  this.triggerImpl = []
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
