const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Sanitation`  // Card names are unique in Innovation
  this.name = `Sanitation`
  this.color = `yellow`
  this.age = 7
  this.expansion = `base`
  this.biscuits = `llhl`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you exchange the two highest cards in your hand with the lowest card in my hand!`
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
