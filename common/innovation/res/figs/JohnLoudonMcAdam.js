const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `John Loudon McAdam`
  this.color = `yellow`
  this.age = 6
  this.biscuits = `hf*f`
  this.dogmaBiscuit = `f`
  this.inspire = `Meld a card from your hand.`
  this.echo = ``
  this.triggers = [
    `You may issue an Expansion Decree with any two figures.`,
    `Each top card with a {f} on your board counts as an available achievement for you.`
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
