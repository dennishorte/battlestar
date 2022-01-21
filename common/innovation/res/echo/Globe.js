const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Globe`  // Card names are unique in Innovation
  this.name = `Globe`
  this.color = `green`
  this.age = 4
  this.expansion = `echo`
  this.biscuits = `f4fh`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may return up to three cards from your hand of the same color. If you return one, splay any color left; two, right; three, up. If you returned at least one card, draw and foreshadow a {6}.`
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
