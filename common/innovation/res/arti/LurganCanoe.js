const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Lurgan Canoe`
  this.color = `yellow`
  this.age = 1
  this.biscuits = `hccc`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.triggers = []
  this.dogma = [
    `Meld a card from your hand. Score all other cards of the same color from your board. If you scored at least one card, repeat this effect.`
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
