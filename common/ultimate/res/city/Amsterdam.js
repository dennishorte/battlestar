const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Amsterdam`  // Card names are unique in Innovation
  this.name = `Amsterdam`
  this.color = `green`
  this.age = 5
  this.expansion = `city`
  this.biscuits = `kl|k+h`
  this.dogmaBiscuit = `k`
  this.echo = ``
  this.karma = []
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = []
  this.karmaImpl = []
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
