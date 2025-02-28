const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Proverb`  // Card names are unique in Innovation
  this.name = `Proverb`
  this.color = `blue`
  this.age = 1
  this.expansion = `usee`
  this.biscuits = `hckk`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw, reveal, and return a [1]. If the color of the returned card is yellow or purple, safeguard an available achievement of value equal to your hand size. If you do, then return all cards from your hand. Otherwise, draw two [1].`
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
