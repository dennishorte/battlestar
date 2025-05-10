const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Warsaw`  // Card names are unique in Innovation
  this.name = `Warsaw`
  this.color = `red`
  this.age = 11
  this.expansion = `city`
  this.biscuits = `ibsi=h`
  this.dogmaBiscuit = `i`
  this.echo = ``
  this.karma = []
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = []
  this.karmaImpl = []
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
