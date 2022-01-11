const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Masonry`  // Card names are unique in Innovation
  this.name = `Masonry`
  this.color = `yellow`
  this.age = 1
  this.expansion = `base`
  this.biscuits = `khkk`
  this.dogmaBiscuit = `k`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may meld any number of cards from your hand, each with a {k}. If you melded four or more cards in this way, claim the Monument achievement.`
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
