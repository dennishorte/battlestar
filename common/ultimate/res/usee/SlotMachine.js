const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Slot Machine`  // Card names are unique in Innovation
  this.name = `Slot Machine`
  this.color = `purple`
  this.age = 7
  this.expansion = `usee`
  this.biscuits = `fiih`
  this.dogmaBiscuit = `i`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw and reveal a {1}, {2}, {3}, {4}, and {5}. If at least one drawn card is green, splay your green or purple cards right. If at least two are, score all drawn cards, otherwise return them. If at least three are, you win.`
  ]

  this.dogmaImpl = [
    (game, player) => {

    },
  ]
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
