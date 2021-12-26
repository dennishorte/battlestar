const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Moylough Belt Shrine`
  this.color = `yellow`
  this.age = 3
  this.biscuits = `klhk`
  this.dogmaBiscuit = `k`
  this.inspire = ``
  this.echo = ``
  this.triggers = []
  this.dogma = [
    `I compel your to reveal all cards in your hand and transfer the card of my choice to my board.`
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
