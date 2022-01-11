const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Industrialization`  // Card names are unique in Innovation
  this.name = `Industrialization`
  this.color = `red`
  this.age = 6
  this.expansion = `base`
  this.biscuits = `cffh`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw and tuck a {6} for every color on your board with one or more {f}.`,
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
