const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Syncom 3`  // Card names are unique in Innovation
  this.name = `Syncom 3`
  this.color = `green`
  this.age = 9
  this.expansion = `arti`
  this.biscuits = `hiii`
  this.dogmaBiscuit = `i`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Return all cards from your hand. Draw and reveal five {9}. If you revealed all five colors, you win.`
  ]

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
