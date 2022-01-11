const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Terracotta Army`  // Card names are unique in Innovation
  this.name = `Terracotta Army`
  this.color = `yellow`
  this.age = 2
  this.expansion = `arti`
  this.biscuits = `ccch`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I compel you to return a top card with no {k}!`,
    `Score a card from your hand with no {k}.`
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
