const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Philosopher's Stone`  // Card names are unique in Innovation
  this.name = `Philosopher's Stone`
  this.color = `green`
  this.age = 3
  this.expansion = `arti`
  this.biscuits = `ccch`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Return a card from your hand. Score a number of cards from your hand equal to the value of the card returned.`
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
