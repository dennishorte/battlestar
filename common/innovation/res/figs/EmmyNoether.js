const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Emmy Noether`  // Card names are unique in Innovation
  this.name = `Emmy Noether`
  this.color = `green`
  this.age = 8
  this.expansion = `figs`
  this.biscuits = `*iih`
  this.dogmaBiscuit = `i`
  this.inspire = `Draw and meld an {8}.`
  this.echo = ``
  this.karma = [
    `Each {i} on your board provides an additional number of points equal to the number of {i} on your board.`
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
