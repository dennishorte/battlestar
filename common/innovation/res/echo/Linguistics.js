const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Linguistics`  // Card names are unique in Innovation
  this.name = `Linguistics`
  this.color = `blue`
  this.age = 2
  this.expansion = `echo`
  this.biscuits = `ss&h`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = `Draw a {3} OR Draw and foreshadow a {4}.`
  this.karma = []
  this.dogma = [
    `Draw a card of value equal to a bonus on your board, if you have any.`
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
