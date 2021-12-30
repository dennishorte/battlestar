const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Agriculture`  // Card names are unique in Innovation
  this.name = `Agriculture`
  this.color = `yellow`
  this.age = 1
  this.expansion = `base`
  this.biscuits = `hlll`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.triggers = []
  this.dogma = [
    `You may return a card from your hand. If you do, draw and score a ard ofo value one higher than the card you returned.`
  ]

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
