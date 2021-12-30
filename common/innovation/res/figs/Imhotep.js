const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Imhotep`  // Card names are unique in Innovation
  this.name = `Imhotep`
  this.color = `blue`
  this.age = 1
  this.expansion = `figs`
  this.biscuits = `khk&`
  this.dogmaBiscuit = `k`
  this.inspire = ``
  this.echo = `Draw and meld a {2}.`
  this.triggers = [
    `If you would meld a card over an unsplayed color with more than one card, instead splay that color left and return the card.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = []
  this.inspireImpl = []
  this.triggerImpl = []
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
