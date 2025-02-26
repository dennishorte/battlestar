const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Buenos Aires`  // Card names are unique in Innovation
  this.name = `Buenos Aires`
  this.color = `purple`
  this.age = 8
  this.expansion = `city`
  this.biscuits = `9i9s9h`
  this.dogmaBiscuit = `s`
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
