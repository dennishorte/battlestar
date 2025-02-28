const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Probability`  // Card names are unique in Innovation
  this.name = `Probability`
  this.color = `blue`
  this.age = 5
  this.expansion = `usee`
  this.biscuits = `hsss`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Return all cards from your hand.`,
    `Draw and meld two {5}, then return them. If exactly two different icon types appear on the drawn cards, draw and score two {5}. If exactly four different icon types appear, draw a {5}. Draw a {4}.`
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
