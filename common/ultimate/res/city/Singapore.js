const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Singapore`  // Card names are unique in Innovation
  this.name = `Singapore`
  this.color = `red`
  this.age = 10
  this.expansion = `city`
  this.biscuits = `aafcfh`
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
