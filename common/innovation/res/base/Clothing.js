const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Clothing`  // Card names are unique in Innovation
  this.name = `Clothing`
  this.color = `green`
  this.age = 1
  this.expansion = `base`
  this.biscuits = `hcll`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Meld a card from your hand of a different color from any card on your board.`,
    `Draw and score a {1} for each color present on your board not present on any opponent's board.`
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
