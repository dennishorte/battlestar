const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Montreal`  // Card names are unique in Innovation
  this.name = `Montreal`
  this.color = `red`
  this.age = 7
  this.expansion = `city`
  this.biscuits = `ff+c+h`
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
