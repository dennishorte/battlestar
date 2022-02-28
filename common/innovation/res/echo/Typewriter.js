const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Typewriter`  // Card names are unique in Innovation
  this.name = `Typewriter`
  this.color = `blue`
  this.age = 7
  this.expansion = `echo`
  this.biscuits = `shcc`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Return all cards from your hand. Draw a {6}. For each color of card returned, draw a card of the next higher value.`
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
