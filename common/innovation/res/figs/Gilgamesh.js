const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Gilgamesh`  // Card names are unique in Innovation
  this.name = `Gilgamesh`
  this.color = `red`
  this.age = 1
  this.expansion = `figs`
  this.biscuits = `*h1k`
  this.dogmaBiscuit = `k`
  this.inspire = `Score a card from your hand.`
  this.echo = ``
  this.karma = [
    `Each bonus on your board provides one additional {k} for every top card on your board.`
  ]
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
