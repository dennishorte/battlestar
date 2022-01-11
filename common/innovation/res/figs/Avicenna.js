const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Avicenna`  // Card names are unique in Innovation
  this.name = `Avicenna`
  this.color = `yellow`
  this.age = 3
  this.expansion = `figs`
  this.biscuits = `*lhl`
  this.dogmaBiscuit = `l`
  this.inspire = `Draw and tuck a {3}.`
  this.echo = ``
  this.karma = [
    `You may issue an Expansion Decree with any two figures.`,
    `If you are required to fade a figure, instead do nothing.`
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
