const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Principa`  // Card names are unique in Innovation
  this.name = `Principa`
  this.color = `blue`
  this.age = 5
  this.expansion = `arti`
  this.biscuits = `sshs`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Return all non-blue top cards from yoru board. For each card returned, draw and meld a card of value one higher than the value of the returned card, in ascending order.`
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
