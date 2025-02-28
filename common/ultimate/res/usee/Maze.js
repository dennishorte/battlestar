const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Maze`  // Card names are unique in Innovation
  this.name = `Maze`
  this.color = `red`
  this.age = 1
  this.expansion = `usee`
  this.biscuits = `kkhk`
  this.dogmaBiscuit = `k`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you score a card from your hand of matching color for each card in my hand. If you don't, and I turn a card in my hand, I'll exchange all cards in your hand with all cards in my score pile!`
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
