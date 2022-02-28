const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `GPS`  // Card names are unique in Innovation
  this.name = `GPS`
  this.color = `green`
  this.age = 10
  this.expansion = `echo`
  this.biscuits = `chii`
  this.dogmaBiscuit = `i`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you return all cards from your forecast!`,
    `Draw and foreshadow three {0}.`,
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
