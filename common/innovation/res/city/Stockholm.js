const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Stockholm`  // Card names are unique in Innovation
  this.name = `Stockholm`
  this.color = `green`
  this.age = 5
  this.expansion = `city`
  this.biscuits = `fc5c;h`
  this.dogmaBiscuit = `c`
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
