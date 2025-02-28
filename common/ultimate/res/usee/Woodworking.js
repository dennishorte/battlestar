const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Woodworking`  // Card names are unique in Innovation
  this.name = `Woodworking`
  this.color = `green`
  this.age = 1
  this.expansion = `usee`
  this.biscuits = `llhs`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw and meld a [2]. If the melded card is a bottom card on your board, score it.`
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
