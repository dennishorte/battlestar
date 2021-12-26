const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Fu Xi`
  this.color = `green`
  this.age = 1
  this.biscuits = `&chc`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = `Draw and score a {2}.`
  this.triggers = [
    `You may issue a Trade Decree with any two figures.`,
    `Each card in your score pile and forecast provides one additional {s}.`
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
