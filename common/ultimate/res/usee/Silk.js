const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Silk`  // Card names are unique in Innovation
  this.name = `Silk`
  this.color = `yellow`
  this.age = 1
  this.expansion = `usee`
  this.biscuits = `cclh`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Meld a card from your hand.`,
    `You may score a card from your hand of each color on your board.`
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
