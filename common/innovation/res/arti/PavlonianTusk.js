const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Pavlonian Tusk`  // Card names are unique in Innovation
  this.name = `Pavlonian Tusk`
  this.color = `red`
  this.age = 1
  this.expansion = `arti`
  this.biscuits = `hckc`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw three cards of value equal to your top green card. Return one of the drawn cards. Score one of the drawn cards.`
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
