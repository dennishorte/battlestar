const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Statistics`  // Card names are unique in Innovation
  this.name = `Statistics`
  this.color = `yellow`
  this.age = 5
  this.expansion = `base`
  this.biscuits = `lslh`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you transferr all the highest cards in your score pile to your hand.`,
    `You may splay your yellow cards right.`
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
