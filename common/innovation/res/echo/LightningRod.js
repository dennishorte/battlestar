const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Lightning Rod`  // Card names are unique in Innovation
  this.name = `Lightning Rod`
  this.color = `blue`
  this.age = 5
  this.expansion = `echo`
  this.biscuits = `&fh6`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = `Draw and tuck a {5}.`
  this.karma = []
  this.dogma = [
    `I demand you draw and tuck a {5}! Return your top card of the tucked card's color.`,
    `Draw and tuck a {5}. You may return a top card from your board.`
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
