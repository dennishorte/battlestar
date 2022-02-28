const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Crossword`  // Card names are unique in Innovation
  this.name = `Crossword`
  this.color = `purple`
  this.age = 8
  this.expansion = `echo`
  this.biscuits = `c8hc`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `For each visible bonus on your board, draw a card of that value.`
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
