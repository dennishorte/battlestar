const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Mathematics`  // Card names are unique in Innovation
  this.name = `Mathematics`
  this.color = `blue`
  this.age = 2
  this.expansion = `base`
  this.biscuits = `hscs`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may return a card from your hand. If you do, draw and meld a card of value one higher than the card you returned.`
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
