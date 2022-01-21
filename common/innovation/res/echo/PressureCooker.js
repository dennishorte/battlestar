const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Pressure Cooker`  // Card names are unique in Innovation
  this.name = `Pressure Cooker`
  this.color = `yellow`
  this.age = 5
  this.expansion = `echo`
  this.biscuits = `5hss`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Return all cards from your hand. For each top card on your board with a bonus, draw a card of value equal to that bonus.`
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
