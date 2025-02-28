const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Freemasons`  // Card names are unique in Innovation
  this.name = `Freemasons`
  this.color = `yellow`
  this.age = 3
  this.expansion = `usee`
  this.biscuits = `chck`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `For each color, you may tuck a card from your hand of that color. If you tuck any yellow cards or expansion cards, draw two {3}.`,
    `You may splay your yellow or blue cards left.`
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
