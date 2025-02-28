const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Pilgrimage`  // Card names are unique in Innovation
  this.name = `Pilgrimage`
  this.color = `green`
  this.age = 1
  this.expansion = `usee`
  this.biscuits = `llhl`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may return a card of value 1 from your hand. If you do, achieve an available achievement of value equal to the returned card, then repeat this effect using a value one higher.`,
    `Draw and tuck all cards in the [1] deck.`
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
