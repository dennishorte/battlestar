const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Riyadh`  // Card names are unique in Innovation
  this.name = `Riyadh`
  this.color = `green`
  this.age = 11
  this.expansion = `city`
  this.biscuits = `itctth`
  this.dogmaBiscuit = `i`
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
