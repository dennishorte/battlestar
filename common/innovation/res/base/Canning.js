const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Canning`  // Card names are unique in Innovation
  this.name = `Canning`
  this.color = `yellow`
  this.age = 6
  this.expansion = `base`
  this.biscuits = `hflf`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may draw and tuck a {6}. If you do, score all your top cards without a {6}.`,
    `You may splay your yellow cards right.`
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
