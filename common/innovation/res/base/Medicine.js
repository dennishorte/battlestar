const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Medicine`
  this.color = `yellow`
  this.age = 3
  this.biscuits = `cllh`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.triggers = []
  this.dogma = [
    `I demand you exchange the highest card in your score pile with the lowest card in my score pile.`
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
