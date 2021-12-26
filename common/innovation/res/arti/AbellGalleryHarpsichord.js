const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Abell Gallery Harpsichord`
  this.color = `purple`
  this.age = 4
  this.biscuits = `lhcl`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.triggers = []
  this.dogma = [
    `For each value of top card on your board appearing exactly once, draw and score a card of that value in ascending order.`
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
