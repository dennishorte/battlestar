const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Sandham Room Cricket Bat`
  this.color = `purple`
  this.age = 5
  this.biscuits = `llfh`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.triggers = []
  this.dogma = [
    `Draw and reveal a {6}. If it is red, claim an achievement, ignoring eligibility.`
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
