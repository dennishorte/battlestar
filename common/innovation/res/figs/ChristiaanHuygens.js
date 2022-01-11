const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Christiaan Huygens`  // Card names are unique in Innovation
  this.name = `Christiaan Huygens`
  this.color = `blue`
  this.age = 5
  this.expansion = `figs`
  this.biscuits = `&ssh`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = `Draw and foreshadow a {7}, {8}, {9}, or {0}.`
  this.karma = [
    `If you would foreshadow a card, instead meld it if it both has a {i} and its value is no more than two higher than your highest top card. Otherwise, foreshadow it.`
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
