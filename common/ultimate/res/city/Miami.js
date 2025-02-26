const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Miami`  // Card names are unique in Innovation
  this.name = `Miami`
  this.color = `yellow`
  this.age = 9
  this.expansion = `city`
  this.biscuits = `9c9llh`
  this.dogmaBiscuit = `l`
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
