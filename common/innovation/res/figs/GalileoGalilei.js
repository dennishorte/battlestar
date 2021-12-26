const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Galileo Galilei`
  this.color = `green`
  this.age = 4
  this.biscuits = `hcc&`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = `Draw and foreshadow a {5} or {6}.`
  this.triggers = [
    `If you would foreshadow a card of value not present in your forecast, first transfer all cards from your forecast into your hand.`
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
