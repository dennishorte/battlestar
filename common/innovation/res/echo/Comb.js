const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Comb`  // Card names are unique in Innovation
  this.name = `Comb`
  this.color = `green`
  this.age = 1
  this.expansion = `echo`
  this.biscuits = `kklh`
  this.dogmaBiscuit = `k`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Choose a color, then draw and reveal five {1}s. Keep all cards that match the color chosen, Return the rest of the drawn cards.`
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
