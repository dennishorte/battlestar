const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Bartolomeo Cristofori`
  this.color = `purple`
  this.age = 5
  this.biscuits = `l*hl`
  this.dogmaBiscuit = `l`
  this.inspire = `Meld a card from your hand.`
  this.echo = ``
  this.triggers = [
    `If you would meld the fifth visible card of a color on your board, first claim an achievement ignoring the scoring restriction.`
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
