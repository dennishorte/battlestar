const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Corvette Challenger`  // Card names are unique in Innovation
  this.name = `Corvette Challenger`
  this.color = `blue`
  this.age = 7
  this.expansion = `arti`
  this.biscuits = `lshl`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw and tuck an {8}. Splay up the color of the tucked card. Draw and score a card of value equal to the number of cards of that color visible on your board.`
  ]

  this.dogmaImpl = []
  this.echoImpl = []
  this.inspireImpl = []
  this.karmaImpl = []
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
