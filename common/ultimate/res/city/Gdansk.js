const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Gdansk`  // Card names are unique in Innovation
  this.name = `Gdansk`
  this.color = `purple`
  this.age = 5
  this.expansion = `city`
  this.biscuits = `c5fc;h`
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
