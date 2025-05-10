const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Seattle`  // Card names are unique in Innovation
  this.name = `Seattle`
  this.color = `blue`
  this.age = 11
  this.expansion = `city`
  this.biscuits = `ffbp=h`
  this.dogmaBiscuit = `f`
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
