const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Luna 3`  // Card names are unique in Innovation
  this.name = `Luna 3`
  this.color = `blue`
  this.age = 9
  this.expansion = `arti`
  this.biscuits = `fhff`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Return all cards from your score pile. Draw and score a card of value equal to the numer of cards returned.`
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
