const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Xianrendong Shards`
  this.color = `yellow`
  this.age = 1
  this.biscuits = `hlll`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.triggers = []
  this.dogma = [
    `Reveal three cards from your hand. Score two, then tuck the other. If the scored cards were the same color, draw three {1}s.`
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
