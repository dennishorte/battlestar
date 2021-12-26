const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `The Daily Courant`
  this.color = `yellow`
  this.age = 5
  this.biscuits = `ffch`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = ``
  this.triggers = []
  this.dogma = [
    `Draw a card of any value, then place it on top of the draw pile of its age. Execute the effects of one of your other top cards as if they were on this card. Do not share them.`
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
