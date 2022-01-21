const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Deodorant`  // Card names are unique in Innovation
  this.name = `Deodorant`
  this.color = `yellow`
  this.age = 3
  this.expansion = `echo`
  this.biscuits = `c&ch`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = `Draw and meld a {3}.`
  this.karma = []
  this.dogma = [
    `If you have a top card with a {k}, draw and meld a {3}. Otherwise, draw a {4}.`
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
