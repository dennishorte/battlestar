const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Toronto`  // Card names are unique in Innovation
  this.name = `Toronto`
  this.color = `green`
  this.age = 7
  this.expansion = `city`
  this.biscuits = `77ilih`
  this.dogmaBiscuit = `i`
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
