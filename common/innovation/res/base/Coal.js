const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Coal`  // Card names are unique in Innovation
  this.name = `Coal`
  this.color = `red`
  this.age = 5
  this.expansion = `base`
  this.biscuits = `fffh`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw and tuck a {5}.`,
    `You may splay your red cards right.`,
    `You may score any one of your top cards. If you do, also score the card beneath it.`
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
