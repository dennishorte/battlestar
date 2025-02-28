const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Illuminati`  // Card names are unique in Innovation
  this.name = `Illuminati`
  this.color = `purple`
  this.age = 6
  this.expansion = `usee`
  this.biscuits = `shss`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Reveal a card in your hand. Splay the card's color on your board right. Safeguard the top card on your board of that color. Safeguard an available achievement of value one higher than the secret.`
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
