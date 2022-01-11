const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Perspective`  // Card names are unique in Innovation
  this.name = `Perspective`
  this.color = `yellow`
  this.age = 4
  this.expansion = `base`
  this.biscuits = `hssl`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may return a card from your hand. If you do, score a card from your hand for every two {s} on your board.`
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
