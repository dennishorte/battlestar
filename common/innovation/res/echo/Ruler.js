const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Ruler`  // Card names are unique in Innovation
  this.name = `Ruler`
  this.color = `blue`
  this.age = 1
  this.expansion = `echo`
  this.biscuits = `shs&`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = `Draw a {2}.`
  this.karma = []
  this.dogma = [
    `No effect.`
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
