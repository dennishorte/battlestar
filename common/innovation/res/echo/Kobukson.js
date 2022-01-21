const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Kobukson`  // Card names are unique in Innovation
  this.name = `Kobukson`
  this.color = `red`
  this.age = 4
  this.expansion = `echo`
  this.biscuits = `5fh&`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = `Splay left one color on any player's board.`
  this.karma = []
  this.dogma = [
    `I demand you return all your top cards with a {k}! Draw and tuck a {4}!`,
    `For every two cards returned as a result of the demand, draw and tuck a {4}.`
  ]

  this.dogmaImpl = []
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
