const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Tehran`  // Card names are unique in Innovation
  this.name = `Tehran`
  this.color = `red`
  this.age = 6
  this.expansion = `city`
  this.biscuits = `fc>c;h`
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
