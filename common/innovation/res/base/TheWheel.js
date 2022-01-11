const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `The Wheel`  // Card names are unique in Innovation
  this.name = `The Wheel`
  this.color = `green`
  this.age = 1
  this.expansion = `base`
  this.biscuits = `hkkk`
  this.dogmaBiscuit = `k`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw two {1}.`
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
