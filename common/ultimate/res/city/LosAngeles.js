const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Los Angeles`  // Card names are unique in Innovation
  this.name = `Los Angeles`
  this.color = `red`
  this.age = 8
  this.expansion = `city`
  this.biscuits = `9f9s9h`
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
