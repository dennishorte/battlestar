const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Liquid Fire`  // Card names are unique in Innovation
  this.name = `Liquid Fire`
  this.color = `red`
  this.age = 3
  this.expansion = `echo`
  this.biscuits = `hsss`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you draw and reveal a card of value equal to the highest bonus on your board! Transfer it to my forecast! If it is red, transfer all cards from your hand to my score pile.`
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
