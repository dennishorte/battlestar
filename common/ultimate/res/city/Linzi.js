const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Linzi`  // Card names are unique in Innovation
  this.name = `Linzi`
  this.color = `yellow`
  this.age = 1
  this.expansion = `city`
  this.biscuits = `kcckkh`
  this.dogmaBiscuit = `k`
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
