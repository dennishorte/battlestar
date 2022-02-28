const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Nylon`  // Card names are unique in Innovation
  this.name = `Nylon`
  this.color = `green`
  this.age = 8
  this.expansion = `echo`
  this.biscuits = `8ffh`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw and tuck an {8} for every three {f} on your board. If any of the tucked cards were green, repeat this dogma effect.`,
    `You may splay your red cards up.`
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
