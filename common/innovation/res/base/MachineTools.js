const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Machine Tools`  // Card names are unique in Innovation
  this.name = `Machine Tools`
  this.color = `red`
  this.age = 6
  this.expansion = `base`
  this.biscuits = `ffhf`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw and score a card of value equal to the highest card in your score pile.`
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
