const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Plato`  // Card names are unique in Innovation
  this.name = `Plato`
  this.color = `purple`
  this.age = 2
  this.expansion = `figs`
  this.biscuits = `shs*`
  this.dogmaBiscuit = `s`
  this.inspire = `You may splay one color of your cards left.`
  this.echo = ``
  this.karma = [
    `You may issue a Rivalry Decree with any two figures.`,
    `Each splayed stack on your board provides one additional {k}, {s}, {l}, and {c}.`
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
