const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Hansen Writing Ball`  // Card names are unique in Innovation
  this.name = `Hansen Writing Ball`
  this.color = `green`
  this.age = 7
  this.expansion = `arti`
  this.biscuits = `ilih`
  this.dogmaBiscuit = `i`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I compel you to draw four {7}! Meld a blue card, then transfer all cards in your hand to my hand!`,
    `Draw and reveal a {7}. If it has no {i}, truck it and repeat this effect.`
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
