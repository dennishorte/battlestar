const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `A.I.`  // Card names are unique in Innovation
  this.name = `A.I.`
  this.color = `purple`
  this.age = 10
  this.expansion = `base`
  this.biscuits = `ssih`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw and score a {0}.`,
    `If Robotics and Software are top cards on any board, the single player with the lowest score wins.`
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
