const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Nairobi`  // Card names are unique in Innovation
  this.name = `Nairobi`
  this.color = `yellow`
  this.age = 11
  this.expansion = `city`
  this.biscuits = `fl:l:h`
  this.dogmaBiscuit = `l`
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
