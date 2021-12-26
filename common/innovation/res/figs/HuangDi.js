const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Huang Di`
  this.color = `blue`
  this.age = 1
  this.biscuits = `ss&h`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = `Draw a {2}.`
  this.triggers = [
    `You may issue an advancement decree with any two figures.`,
    `Each {s} on your board provides one additional {l}.`
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
