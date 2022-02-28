const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Kaleidoscope`  // Card names are unique in Innovation
  this.name = `Kaleidoscope`
  this.color = `purple`
  this.age = 6
  this.expansion = `echo`
  this.biscuits = `6shs`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw and meld a {7}. You may splay your cards of that color right.`
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
