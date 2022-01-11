const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Databases`  // Card names are unique in Innovation
  this.name = `Databases`
  this.color = `green`
  this.age = 10
  this.expansion = `base`
  this.biscuits = `hiii`
  this.dogmaBiscuit = `i`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you return half (rounded up) of the cards in your score pile.`
  ]

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
