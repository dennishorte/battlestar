const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Rock Around the Clock`  // Card names are unique in Innovation
  this.name = `Rock Around the Clock`
  this.color = `yellow`
  this.age = 9
  this.expansion = `arti`
  this.biscuits = `lihi`
  this.dogmaBiscuit = `i`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `For each top card on your board with a {i}, draw and score a {9}.`
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
