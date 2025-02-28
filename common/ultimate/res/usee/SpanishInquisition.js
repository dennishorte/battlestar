const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Spanish Inquisition`  // Card names are unique in Innovation
  this.name = `Spanish Inquisition`
  this.color = `red`
  this.age = 4
  this.expansion = `usee`
  this.biscuits = `shss`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you return all but the highest cards from your hand and all but the highest cards from your score pile!`,
    `If Spanish Inquisition is a top card on your board, return all red cards from your board.`
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
