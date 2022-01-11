const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Printing Press`  // Card names are unique in Innovation
  this.name = `Printing Press`
  this.color = `blue`
  this.age = 4
  this.expansion = `base`
  this.biscuits = `hssc`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may return a card from your score pile. If you do, draw a card of value two higher than the top purple card on your board.`,
    `You may splay your blue cards right.`
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
