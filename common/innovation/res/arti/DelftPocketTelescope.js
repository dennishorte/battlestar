const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Delft Pocket Telescope`
  this.color = `blue`
  this.age = 4
  this.biscuits = `fhss`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.triggers = []
  this.dogma = [
    `Return a card from yoru score pile. If you do, draw a {5} and a {6}, then reveal one of the drawn cards that has a symbol in common with the returned card. If you cannot, return hte drawn cards and repeat the effect.`
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
