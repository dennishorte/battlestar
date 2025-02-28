const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Cipher`  // Card names are unique in Innovation
  this.name = `Cipher`
  this.color = `green`
  this.age = 2
  this.expansion = `usee`
  this.biscuits = `hssk`
  this.dogmaBiscuit = `p`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Return all cards from your hand. If you return at least two, draw a card of value one higher than the highest value of card you return.`,
    `Draw a [3]. You may splay your blue cards left.`
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
