const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Naples`  // Card names are unique in Innovation
  this.name = `Naples`
  this.color = `blue`
  this.age = 5
  this.expansion = `city`
  this.biscuits = `ss+l+h`
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
