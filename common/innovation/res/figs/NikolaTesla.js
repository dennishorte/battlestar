const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Nikola Tesla`
  this.color = `yellow`
  this.age = 8
  this.biscuits = `8*sh`
  this.dogmaBiscuit = `s`
  this.inspire = `Draw an {8}.`
  this.echo = ``
  this.triggers = [
    `You may issue an Expansion Decree with any two figures.`,
    `If you would meld a card with a {s} or {i}, first score an opponent's top card with neither {s} nor {i}.`
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