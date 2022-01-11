const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Baghdad Battery`  // Card names are unique in Innovation
  this.name = `Baghdad Battery`
  this.color = `green`
  this.age = 2
  this.expansion = `arti`
  this.biscuits = `cshc`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Meld two cards from your hand. If you melded two of the same color and they are of different type, draw and score five {2}s.`
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
