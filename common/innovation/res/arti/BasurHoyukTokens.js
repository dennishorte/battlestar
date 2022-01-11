const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Basur Hoyuk Tokens`  // Card names are unique in Innovation
  this.name = `Basur Hoyuk Tokens`
  this.color = `blue`
  this.age = 1
  this.expansion = `arti`
  this.biscuits = `chll`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw and reveal a {4}. If you have a top card of the drawn card's color that comes before it in the alphabet, return the drawn card and all cards from your score pile.`
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
