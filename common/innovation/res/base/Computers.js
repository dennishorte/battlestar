const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Computers`  // Card names are unique in Innovation
  this.name = `Computers`
  this.color = `blue`
  this.age = 9
  this.expansion = `base`
  this.biscuits = `ihif`
  this.dogmaBiscuit = `i`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may splay your red or green cards up.`,
    `Draw and meld a {0}, then execute each of its non-demand dogma effects. Do not share them.`
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
