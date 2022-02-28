const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Seville`  // Card names are unique in Innovation
  this.name = `Seville`
  this.color = `purple`
  this.age = 4
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
