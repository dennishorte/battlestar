const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Plush Beweglich Rod Bear`
  this.color = `yellow`
  this.age = 8
  this.biscuits = `lllh`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.triggers = []
  this.dogma = [
    `Choose a value. Splay up each color with a top card of the chosen value. Return all cards of the chosen value from all score piles.`
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
