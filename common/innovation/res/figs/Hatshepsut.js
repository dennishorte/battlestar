const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Hatshepsut`  // Card names are unique in Innovation
  this.name = `Hatshepsut`
  this.color = `green`
  this.age = 1
  this.expansion = `figs`
  this.biscuits = `1c*h`
  this.dogmaBiscuit = `c`
  this.inspire = `Draw a {1}`
  this.echo = ``
  this.karma = [
    `If you would draw a card of value higher than 1 and you have a {1} in your hand, first return all cards from your hand and draw two cards of that value.`
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
