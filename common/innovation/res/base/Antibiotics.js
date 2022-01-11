const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Antibiotics`  // Card names are unique in Innovation
  this.name = `Antibiotics`
  this.color = `yellow`
  this.age = 8
  this.expansion = `base`
  this.biscuits = `lllh`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may return up to three cards from your hand. For every different value of card that you returned, draw two {8}.`
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
