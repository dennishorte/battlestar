const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Almira, Queen of the Castle`
  this.color = `purle`
  this.age = 5
  this.biscuits = `chcc`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.triggers = []
  this.dogma = [
    `Meld a card from your hand. Claim an achievement of matching value, ignoring eligiblilty.`
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
