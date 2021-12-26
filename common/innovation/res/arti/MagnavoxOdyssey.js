const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Magnavox Odyssey`
  this.color = `yellow`
  this.age = 9
  this.biscuits = `slhs`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.triggers = []
  this.dogma = [
    `Draw and meld two {0}. If they are the same color, you win.`
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
