const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Baroque-Longue la Belle`  // Card names are unique in Innovation
  this.name = `Baroque-Longue la Belle`
  this.color = `green`
  this.age = 5
  this.expansion = `arti`
  this.biscuits = `fhfc`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw and meld a {5}. If the drawn card is not green, repeat this effect.`
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
