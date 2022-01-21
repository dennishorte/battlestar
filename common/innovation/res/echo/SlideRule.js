const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Slide Rule`  // Card names are unique in Innovation
  this.name = `Slide Rule`
  this.color = `blue`
  this.age = 4
  this.expansion = `echo`
  this.biscuits = `sssh`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may splay your yellow cards right.`,
    `Draw a card of value equal to the value of your lowest top card plus the number of colors you have splayed.`
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
