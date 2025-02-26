const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Luoyang`  // Card names are unique in Innovation
  this.name = `Luoyang`
  this.color = `purple`
  this.age = 2
  this.expansion = `city`
  this.biscuits = `ssl2+h`
  this.dogmaBiscuit = `s`
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
