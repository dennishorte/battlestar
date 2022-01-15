const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Ice Skates`  // Card names are unique in Innovation
  this.name = `Ice Skates`
  this.color = `green`
  this.age = 1
  this.expansion = `echo`
  this.biscuits = `kchc`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Return up to three cards from your hand. For each card returned, either draw and meld a {2}, or draw and foreshadow a {3}. Return your highest top card.`
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
