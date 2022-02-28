const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `New York City`  // Card names are unique in Innovation
  this.name = `New York City`
  this.color = `purple`
  this.age = 6
  this.expansion = `city`
  this.biscuits = `sc+c+h`
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
