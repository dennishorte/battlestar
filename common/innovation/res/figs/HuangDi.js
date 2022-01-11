const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Huang Di`  // Card names are unique in Innovation
  this.name = `Huang Di`
  this.color = `blue`
  this.age = 1
  this.expansion = `figs`
  this.biscuits = `ss&h`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = `Draw a {2}.`
  this.karma = [
    `You may issue an advancement decree with any two figures.`,
    `Each {s} on your board provides one additional {l}.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = []
  this.inspireImpl = []
  this.karmaImpl = []
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
