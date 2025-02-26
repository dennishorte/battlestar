const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Yin`  // Card names are unique in Innovation
  this.name = `Yin`
  this.color = `blue`
  this.age = 1
  this.expansion = `city`
  this.biscuits = `kllkkh`
  this.dogmaBiscuit = `k`
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
