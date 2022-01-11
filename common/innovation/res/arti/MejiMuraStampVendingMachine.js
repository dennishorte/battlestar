const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Meji-Mura Stamp Vending Machine`  // Card names are unique in Innovation
  this.name = `Meji-Mura Stamp Vending Machine`
  this.color = `green`
  this.age = 8
  this.expansion = `arti`
  this.biscuits = `lchc`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Return a card from your hand. Draw and score three cards of the returned card's value.`
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
