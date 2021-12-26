const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Self Service`
  this.color = `green`
  this.age = 10
  this.biscuits = `hccc`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.triggers = []
  this.dogma = [
    `Execute each of the non-demand dogma effects of any other top card on your board. Do not share them.`,
    `If you have more achievements than each opponent, you win.`
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