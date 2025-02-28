const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Dance`  // Card names are unique in Innovation
  this.name = `Dance`
  this.color = `green`
  this.age = 1
  this.expansion = `usee`
  this.biscuits = `llhl`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Transfer a top card on your board with [l] to the board of any other player. If you do, meld the lowest top card without [l] from that player's board.`
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
