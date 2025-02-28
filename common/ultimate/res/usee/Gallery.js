const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Gallery`  // Card names are unique in Innovation
  this.name = `Gallery`
  this.color = `yellow`
  this.age = 5
  this.expansion = `usee`
  this.biscuits = `csch`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `If you have a {3} in your score pile, draw a {2}.`,
    `If you have a {1} in your score pile, draw a {4}. Otherwise, draw a {3}.`
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
