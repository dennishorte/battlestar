const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Antoine Van Leeuwenhoek`
  this.color = `yellow`
  this.age = 5
  this.biscuits = `&shs`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = `Draw a {6}.`
  this.triggers = [
    `Each card in hand counts as ten points towards the cost of claiming an achievement of that card's value.`
  ]
  this.dogma = []

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