const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Hong Kong`  // Card names are unique in Innovation
  this.name = `Hong Kong`
  this.color = `purple`
  this.age = 9
  this.expansion = `city`
  this.biscuits = `fi+f^h`
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
