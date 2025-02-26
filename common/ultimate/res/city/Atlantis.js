const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Atlantis`  // Card names are unique in Innovation
  this.name = `Atlantis`
  this.color = `blue`
  this.age = 1
  this.expansion = `city`
  this.biscuits = `llllkh`
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
