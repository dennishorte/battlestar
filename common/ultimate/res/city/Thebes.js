const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Thebes`  // Card names are unique in Innovation
  this.name = `Thebes`
  this.color = `red`
  this.age = 1
  this.expansion = `city`
  this.biscuits = `cccssh`
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
