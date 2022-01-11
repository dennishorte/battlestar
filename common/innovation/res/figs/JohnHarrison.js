const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `John Harrison`  // Card names are unique in Innovation
  this.name = `John Harrison`
  this.color = `green`
  this.age = 6
  this.expansion = `figs`
  this.biscuits = `6ch*`
  this.dogmaBiscuit = `c`
  this.inspire = `Draw a {6}.`
  this.echo = ``
  this.karma = [
    `You may issue a Trade Decree with any two figures.`,
    `If an opponent would draw a card for sharing, first draw a {6}. You may choose the type of card drawn.`
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
