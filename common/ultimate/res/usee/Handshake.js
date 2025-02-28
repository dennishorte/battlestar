const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Handshake`  // Card names are unique in Innovation
  this.name = `Handshake`
  this.color = `yellow`
  this.age = 1
  this.expansion = `usee`
  this.biscuits = `hckk`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you transfer all cards from my hand to your hand! Choose two colors of cards in your hand! Transfer all cards in your hand of those colors to my hand!`
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
