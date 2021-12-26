const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Shigeru Miyamoto`
  this.color = `yellow`
  this.age = 10
  this.biscuits = `hai&`
  this.dogmaBiscuit = `i`
  this.inspire = ``
  this.echo = `Draw a {0}. If it does not have a {i}, score it.`
  this.triggers = [
    `If you would take a Dogma action and activate a card using {i} as the featured icon, first if you have exactly one, three, or six {i} on your board, you win.`
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
