const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Rhazes`  // Card names are unique in Innovation
  this.name = `Rhazes`
  this.color = `yellow`
  this.age = 3
  this.expansion = `figs`
  this.biscuits = `hll&`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = `Draw and foreshadow a {3}, {4}, or {5}.`
  this.karma = [
    `If you would draw a card, first tuck a card of the same value from your hand.`
  ]
  this.dogma = []

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
