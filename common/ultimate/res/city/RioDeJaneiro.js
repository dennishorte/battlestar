const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Rio De Janeiro`  // Card names are unique in Innovation
  this.name = `Rio De Janeiro`
  this.color = `green`
  this.age = 6
  this.expansion = `city`
  this.biscuits = `f7fc;h`
  this.dogmaBiscuit = `f`
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
