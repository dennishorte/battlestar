const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Emancipation`  // Card names are unique in Innovation
  this.name = `Emancipation`
  this.color = `purple`
  this.age = 6
  this.expansion = `base`
  this.biscuits = `fsfh`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you transfer a card from your hand to my score pile! If you do, draw a {6}.`,
    `You may splay your red or purple cards right.`
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
