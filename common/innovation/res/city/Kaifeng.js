const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Kaifeng`  // Card names are unique in Innovation
  this.name = `Kaifeng`
  this.color = `yellow`
  this.age = 3
  this.expansion = `city`
  this.biscuits = `klkk<h`
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
