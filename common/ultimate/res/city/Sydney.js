const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Sydney`  // Card names are unique in Innovation
  this.name = `Sydney`
  this.color = `green`
  this.age = 9
  this.expansion = `city`
  this.biscuits = `sc^c:h`
  this.dogmaBiscuit = `c`
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
