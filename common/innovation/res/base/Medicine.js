const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Medicine`  // Card names are unique in Innovation
  this.name = `Medicine`
  this.color = `yellow`
  this.age = 3
  this.expansion = `base`
  this.biscuits = `cllh`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you exchange the highest card in your score pile with the lowest card in my score pile.`
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
