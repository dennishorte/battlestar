const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Napoleon Bonaparte`  // Card names are unique in Innovation
  this.name = `Napoleon Bonaparte`
  this.color = `red`
  this.age = 6
  this.expansion = `figs`
  this.biscuits = `h6f&`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = `Score a top figure of value 5 or 6 from anywhere.`
  this.karma = [
    `You may issue a War Decree with any two figures.`,
    `If you would score or return a card with a {f}, instead tuck it and score a top card of value 6 from anywhere.`
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
