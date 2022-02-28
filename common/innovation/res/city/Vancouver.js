const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Vancouver`  // Card names are unique in Innovation
  this.name = `Vancouver`
  this.color = `purple`
  this.age = 8
  this.expansion = `city`
  this.biscuits = `cs+s+h`
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
