const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Sao Paulo`  // Card names are unique in Innovation
  this.name = `Sao Paulo`
  this.color = `green`
  this.age = 8
  this.expansion = `city`
  this.biscuits = `88cllh`
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
