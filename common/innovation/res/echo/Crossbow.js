const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Crossbow`  // Card names are unique in Innovation
  this.name = `Crossbow`
  this.color = `red`
  this.age = 2
  this.expansion = `echo`
  this.biscuits = `3hkk`
  this.dogmaBiscuit = `k`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you transfer a card with a bonus from your hand to my score pile!`,
    `Transfer a card from your hand to any other player's board.`
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
