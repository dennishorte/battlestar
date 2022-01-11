const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Adam Smith`  // Card names are unique in Innovation
  this.name = `Adam Smith`
  this.color = `green`
  this.age = 6
  this.expansion = `figs`
  this.biscuits = `*fcc`
  this.dogmaBiscuit = `c`
  this.inspire = `You may splay one color of your cards right.`
  this.echo = ``
  this.karma = [
    `Each {c} on your board provides two additional {c}.`
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
