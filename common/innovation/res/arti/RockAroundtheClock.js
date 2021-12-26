const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Rock Around the Clock`
  this.color = `yellow`
  this.age = 9
  this.biscuits = `lihi`
  this.dogmaBiscuit = `i`
  this.inspire = ``
  this.echo = ``
  this.triggers = []
  this.dogma = [
    `For each top card on your board with a {i}, draw and score a {9}.`
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
