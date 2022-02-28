const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Milan`  // Card names are unique in Innovation
  this.name = `Milan`
  this.color = `red`
  this.age = 4
  this.expansion = `city`
  this.biscuits = `ff+s+h`
  this.dogmaBiscuit = `f`
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
