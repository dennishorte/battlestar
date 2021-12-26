const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Yeager's Bell X-1A`
  this.color = `blue`
  this.age = 9
  this.biscuits = `iifh`
  this.dogmaBiscuit = `i`
  this.inspire = ``
  this.echo = ``
  this.triggers = []
  this.dogma = [
    `Draw and meld a {9}. Execute the effects of the melded card as if they were on this card, without sharing. If that card has a {i}, repeat this effect.`
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
