const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Calicut`  // Card names are unique in Innovation
  this.name = `Calicut`
  this.color = `green`
  this.age = 4
  this.expansion = `city`
  this.biscuits = `5clllh`
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
