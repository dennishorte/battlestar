const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `St. Petersburg`  // Card names are unique in Innovation
  this.name = `St. Petersburg`
  this.color = `yellow`
  this.age = 7
  this.expansion = `city`
  this.biscuits = `lf>l;h`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
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
