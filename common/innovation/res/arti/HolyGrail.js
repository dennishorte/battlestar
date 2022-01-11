const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Holy Grail`  // Card names are unique in Innovation
  this.name = `Holy Grail`
  this.color = `yellow`
  this.age = 2
  this.expansion = `arti`
  this.biscuits = `lhcl`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Return a card from your hand. Claim an achievement of matching value ignoring eligibility.`
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
