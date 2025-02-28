const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Password`  // Card names are unique in Innovation
  this.name = `Password`
  this.color = `red`
  this.age = 2
  this.expansion = `usee`
  this.biscuits = `hckk`
  this.dogmaBiscuit = `p`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw and reveal a [2]. You may safeguard another card from your hand of the color of the drawn card. If you do, score the drawn card. Otherwise, return all cards from your hand except the drawn card.`
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
