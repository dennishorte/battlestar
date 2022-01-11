const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Satellites`  // Card names are unique in Innovation
  this.name = `Satellites`
  this.color = `green`
  this.age = 9
  this.expansion = `base`
  this.biscuits = `hiii`
  this.dogmaBiscuit = `i`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Return all cards from your hand, and draw three {8}.`,
    `You may splay your purple cards up.`,
    `Meld a card from your hand and then execute each of its non-demand dogma effects. Do not share them.`
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
