const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Stephen Hawking`
  this.color = `blue`
  this.age = 10
  this.biscuits = `b*sh`
  this.dogmaBiscuit = `s`
  this.inspire = `Draw and tuck a {0}.`
  this.echo = ``
  this.triggers = [
    `Each HEX on your board also counts as an echo effet reading "Score the bottom card of this color".`
  ]
  this.dogma = []

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
