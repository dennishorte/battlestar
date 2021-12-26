const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Plumbing`
  this.color = `red`
  this.age = 1
  this.biscuits = `&2hk`
  this.dogmaBiscuit = `k`
  this.inspire = ``
  this.echo = `Score a bottom card from your board.`
  this.triggers = []
  this.dogma = [
    `No effect.`
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
