const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Tel Aviv`  // Card names are unique in Innovation
  this.name = `Tel Aviv`
  this.color = `green`
  this.age = 10
  this.expansion = `city`
  this.biscuits = `si^i:h`
  this.dogmaBiscuit = `i`
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
