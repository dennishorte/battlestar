const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Mona Lisa`  // Card names are unique in Innovation
  this.name = `Mona Lisa`
  this.color = `yellow`
  this.age = 4
  this.expansion = `arti`
  this.biscuits = `hcll`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Choose a number and a color. Draw five {4}, then reveal your hand. If you have exactly that many cards of that color, score them, and splay right your cards of that color. Otherwise, return all cards from your hand.`
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
