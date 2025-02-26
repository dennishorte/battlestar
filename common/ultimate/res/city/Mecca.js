const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Mecca`  // Card names are unique in Innovation
  this.name = `Mecca`
  this.color = `purple`
  this.age = 3
  this.expansion = `city`
  this.biscuits = `l5cllh`
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
