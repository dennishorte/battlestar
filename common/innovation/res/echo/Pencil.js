const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Pencil`  // Card names are unique in Innovation
  this.name = `Pencil`
  this.color = `yellow`
  this.age = 4
  this.expansion = `echo`
  this.biscuits = `h&s4`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = `Draw a {5}.`
  this.karma = []
  this.dogma = [
    `You may return up to three cards from your hand. If you do, draw that many cards of value one higher than the highest card you returned. Foreshadow one of them, and return the rest of the drawn cards.`
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
