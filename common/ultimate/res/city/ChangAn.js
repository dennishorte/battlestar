const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Chang'An`  // Card names are unique in Innovation
  this.name = `Chang'An`
  this.color = `red`
  this.age = 1
  this.expansion = `city`
  this.biscuits = `lllc+h`
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
