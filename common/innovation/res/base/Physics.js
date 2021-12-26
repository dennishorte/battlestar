const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Physics`
  this.color = `blue`
  this.age = 5
  this.biscuits = `fssh`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.triggers = []
  this.dogma = [
    `Draw three {6} and reveal them. If two or more of the drawn cards are the same color, return the drawn cards and all card in your hand. Otherwise, keep them.`
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