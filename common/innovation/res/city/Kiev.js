const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Kiev`  // Card names are unique in Innovation
  this.name = `Kiev`
  this.color = `blue`
  this.age = 8
  this.expansion = `city`
  this.biscuits = `fi+f+h`
  this.dogmaBiscuit = `f`
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
