const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Telegraph`  // Card names are unique in Innovation
  this.name = `Telegraph`
  this.color = `green`
  this.age = 7
  this.expansion = `echo`
  this.biscuits = `hiis`
  this.dogmaBiscuit = `i`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may choose an opponent and a color. Match your splay in that color to theirs.`,
    `You may splay your blue cards up.`
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
