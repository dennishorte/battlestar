const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Houston`  // Card names are unique in Innovation
  this.name = `Houston`
  this.color = `blue`
  this.age = 9
  this.expansion = `city`
  this.biscuits = `aiacah`
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
