const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Damascus`  // Card names are unique in Innovation
  this.name = `Damascus`
  this.color = `yellow`
  this.age = 1
  this.expansion = `city`
  this.biscuits = `cccckh`
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
