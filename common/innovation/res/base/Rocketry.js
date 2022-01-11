const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Rocketry`  // Card names are unique in Innovation
  this.name = `Rocketry`
  this.color = `blue`
  this.age = 8
  this.expansion = `base`
  this.biscuits = `iiih`
  this.dogmaBiscuit = `i`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Return a card in any opponent's score pile for every two {i} on your board.`
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
