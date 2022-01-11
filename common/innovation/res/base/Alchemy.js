const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Alchemy`  // Card names are unique in Innovation
  this.name = `Alchemy`
  this.color = `blue`
  this.age = 3
  this.expansion = `base`
  this.biscuits = `hlkk`
  this.dogmaBiscuit = `k`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw and reveal a {4} for every three {k} on your board. If ay of the drawn cards are red, return the cards drawn and all card in your hand. Otherwise, keep them.`,
    `Meld a card from your hand, then score a card from your hand.`
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
