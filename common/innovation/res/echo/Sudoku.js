const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Sudoku`  // Card names are unique in Innovation
  this.name = `Sudoku`
  this.color = `purple`
  this.age = 10
  this.expansion = `echo`
  this.biscuits = `shsb`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw and meld a card of any value. If you have at least nine different bonus values visible on your board, you win. Execute each of the melded card's non-demand dogma effects. Do not share them.`
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
