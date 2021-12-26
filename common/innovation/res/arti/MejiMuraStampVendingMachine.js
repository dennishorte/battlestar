const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Meji-Mura Stamp Vending Machine`
  this.color = `green`
  this.age = 8
  this.biscuits = `lchc`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.triggers = []
  this.dogma = [
    `Return a card from your hand. Draw and score three cards of the returned card's value.`
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
