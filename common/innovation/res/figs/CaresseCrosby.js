const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Caresse Crosby`  // Card names are unique in Innovation
  this.name = `Caresse Crosby`
  this.color = `yellow`
  this.age = 8
  this.expansion = `figs`
  this.biscuits = `lh8*`
  this.dogmaBiscuit = `l`
  this.inspire = `Tuck a card from your hand.`
  this.echo = ``
  this.karma = [
    `If you would tuck a card with a {l}, first splay that color of your cards left, then draw two {2}.`,
    `If you would splay a fifth color left, instead you win,.`
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
