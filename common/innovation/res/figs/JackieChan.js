const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Jackie Chan`
  this.color = `red`
  this.age = 10
  this.biscuits = `*iih`
  this.dogmaBiscuit = `i`
  this.inspire = `Score a card from your hand.`
  this.echo = ``
  this.triggers = [
    `If an opponent would win, first score all other top figures in play. If you now have the most points, you win instead.`
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
