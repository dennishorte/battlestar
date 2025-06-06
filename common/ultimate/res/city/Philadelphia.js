const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Philadelphia`  // Card names are unique in Innovation
  this.name = `Philadelphia`
  this.color = `red`
  this.age = 6
  this.expansion = `city`
  this.biscuits = `fi+i+h`
  this.dogmaBiscuit = `i`
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
