const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Rome`  // Card names are unique in Innovation
  this.name = `Rome`
  this.color = `purple`
  this.age = 2
  this.expansion = `city`
  this.biscuits = `2ssksh`
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
