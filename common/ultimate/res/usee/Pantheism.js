const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Pantheism`  // Card names are unique in Innovation
  this.name = `Pantheism`
  this.color = `purple`
  this.age = 5
  this.expansion = `usee`
  this.biscuits = `hlss`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Tuck a card from your hand. If you do, draw and tuck a {5}, score all cards on your board of the color of one of the tucked cards, and splay right the color on your board of the other tucked card.`,
    `Draw and tuck a {5}.`
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
