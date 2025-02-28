const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Metaverse`  // Card names are unique in Innovation
  this.name = `Metaverse`
  this.color = `purple`
  this.age = 11
  this.expansion = `usee`
  this.biscuits = `spph`
  this.dogmaBiscuit = `p`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `For each splayed color on your board, score its top card. If you score fewer than three cards, you lose.`
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
