const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Calendar`
  this.color = `blue`
  this.age = 2
  this.biscuits = `hlls`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.triggers = []
  this.dogma = [
    `If you have more cards in your score pile than in your hand, draw two {3}.`
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
