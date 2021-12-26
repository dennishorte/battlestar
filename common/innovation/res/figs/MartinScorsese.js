const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Martin Scorsese`
  this.color = `purple`
  this.age = 10
  this.biscuits = `fha&`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = `Draw and meld a {0}.`
  this.triggers = [
    `If you would meld a figure, instead tuck the figure and claim a standard achievement, regardless of eligibility.`
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
