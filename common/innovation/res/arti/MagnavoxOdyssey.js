const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Magnavox Odyssey`  // Card names are unique in Innovation
  this.name = `Magnavox Odyssey`
  this.color = `yellow`
  this.age = 9
  this.expansion = `arti`
  this.biscuits = `slhs`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw and meld two {0}. If they are the same color, you win.`
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
