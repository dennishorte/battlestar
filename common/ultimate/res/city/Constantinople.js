const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Constantinople`  // Card names are unique in Innovation
  this.name = `Constantinople`
  this.color = `purple`
  this.age = 3
  this.expansion = `city`
  this.biscuits = `kc3k<h`
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
