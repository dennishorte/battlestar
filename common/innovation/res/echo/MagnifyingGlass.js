const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Magnifying Glass`  // Card names are unique in Innovation
  this.name = `Magnifying Glass`
  this.color = `blue`
  this.age = 3
  this.expansion = `echo`
  this.biscuits = `sh3&`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = `Draw a {4}, then return a card from your hand.`
  this.karma = []
  this.dogma = [
    `You may return three cards of equal value from your hand. If you do, draw a card of value two higher than the cards you returned.`,
    `You may splay your yellow or blue cards left.`
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
