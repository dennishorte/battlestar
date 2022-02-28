const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `X-Ray`  // Card names are unique in Innovation
  this.name = `X-Ray`
  this.color = `blue`
  this.age = 8
  this.expansion = `echo`
  this.biscuits = `hl&8`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = `Draw and tuck and {8}.`
  this.karma = []
  this.dogma = [
    `For every three {l} on your board, draw and foreshadow a card of any value.`,
    `You may splay your yellow cards up.`
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
