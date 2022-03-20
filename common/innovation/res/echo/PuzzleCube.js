const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Puzzle Cube`  // Card names are unique in Innovation
  this.name = `Puzzle Cube`
  this.color = `purple`
  this.age = 10
  this.expansion = `echo`
  this.biscuits = `sshs`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may score the bottom card or bottom two cards of one color from your board. If all the colors on your board contain the same number of visible cards (unsplayed = 1), you win.`,
    `Draw and meld a {0}.`
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
