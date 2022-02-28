const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Marseille`  // Card names are unique in Innovation
  this.name = `Marseille`
  this.color = `green`
  this.age = 2
  this.expansion = `city`
  this.biscuits = `c2ckch`
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
