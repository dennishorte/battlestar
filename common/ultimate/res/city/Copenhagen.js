const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Copenhagen`  // Card names are unique in Innovation
  this.name = `Copenhagen`
  this.color = `yellow`
  this.age = 10
  this.expansion = `city`
  this.biscuits = `li^l=h`
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
