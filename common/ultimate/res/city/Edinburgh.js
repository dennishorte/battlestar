const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Edinburgh`  // Card names are unique in Innovation
  this.name = `Edinburgh`
  this.color = `blue`
  this.age = 6
  this.expansion = `city`
  this.biscuits = `sf+s+h`
  this.dogmaBiscuit = `s`
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
