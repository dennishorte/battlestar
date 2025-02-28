const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Quackery`  // Card names are unique in Innovation
  this.name = `Quackery`
  this.color = `blue`
  this.age = 4
  this.expansion = `usee`
  this.biscuits = `hsfs`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Choose to either score a card from your hand, or draw a {4}.`,
    `Return exactly two cards in your hand. If you do, draw a card of value equal to the sum number of {f} and {l} on the returned cards.`
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
