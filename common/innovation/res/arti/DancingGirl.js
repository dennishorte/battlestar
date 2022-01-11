const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Dancing Girl`  // Card names are unique in Innovation
  this.name = `Dancing Girl`
  this.color = `yellow`
  this.age = 1
  this.expansion = `arti`
  this.biscuits = `hsss`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I compel you to transfer Dancing Girl to your board!`,
    `If Dancing Girl has been on every board during this action, and it started on your board, you win.`
  ]

  this.dogmaImpl = []
  this.echoImpl = []
  this.inspireImpl = []
  this.karmaImpl = []
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
