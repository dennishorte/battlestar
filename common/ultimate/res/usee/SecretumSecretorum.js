const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Secretum Secretorum`  // Card names are unique in Innovation
  this.name = `Secretum Secretorum`
  this.color = `blue`
  this.age = 3
  this.expansion = `usee`
  this.biscuits = `shsc`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Return five cards from your hand and/or score pile. Draw two cards of value equal to the number of different colors of cards you return. Meld one of the drawn cards and score the other.`
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
