const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Lever`  // Card names are unique in Innovation
  this.name = `Lever`
  this.color = `blue`
  this.age = 2
  this.expansion = `echo`
  this.biscuits = `sh&s`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = `Draw two {2}.`
  this.karma = []
  this.dogma = [
    `You may return any number of cards from your hand. For every two cards of matching value returned, draw a card of value one higher.`
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
