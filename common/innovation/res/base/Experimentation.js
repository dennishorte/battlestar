const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Experimentation`  // Card names are unique in Innovation
  this.name = `Experimentation`
  this.color = `blue`
  this.age = 4
  this.expansion = `base`
  this.biscuits = `hsss`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw and meld a 5.`
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
