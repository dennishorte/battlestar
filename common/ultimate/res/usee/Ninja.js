const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Ninja`  // Card names are unique in Innovation
  this.name = `Ninja`
  this.color = `red`
  this.age = 4
  this.expansion = `usee`
  this.biscuits = `clhl`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you return a card of the color of my choice from your hand! If you do, transfer the top card of that color from your board to mine!`,
    `You may splay your red cards right.`
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
