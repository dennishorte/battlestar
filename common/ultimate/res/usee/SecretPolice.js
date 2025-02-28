const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Secret Police`  // Card names are unique in Innovation
  this.name = `Secret Police`
  this.color = `yellow`
  this.age = 3
  this.expansion = `usee`
  this.biscuits = `kkkh`
  this.dogmaBiscuit = `k`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you tuck a card in your hand, then return your top card of its color! If you do, repeat this effect! Otherwise, draw a {1}!`,
    `You may tuck any number of cards of any one color from your hand.`
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
