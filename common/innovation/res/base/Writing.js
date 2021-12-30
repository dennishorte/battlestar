const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Writing`  // Card names are unique in Innovation
  this.name = `Writing`
  this.color = `blue`
  this.age = 1
  this.expansion = `base`
  this.biscuits = `hssc`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.triggers = []
  this.dogma = [
    `Draw a {2}.`
  ]

  this.dogmaImpl = []
  this.echoImpl = []
  this.inspireImpl = []
  this.triggerImpl = []
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
