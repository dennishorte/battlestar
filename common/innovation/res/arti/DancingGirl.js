const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Dancing Girl`
  this.color = `yellow`
  this.age = 1
  this.biscuits = `hsss`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.triggers = []
  this.dogma = [
    `I compel you to transfer Dancing Girl to your board!`,
    `If Dancing Girl has been on every board during this action, and it started on your board, you win.`
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
