const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Necronomicon`  // Card names are unique in Innovation
  this.name = `Necronomicon`
  this.color = `purple`
  this.age = 3
  this.expansion = `arti`
  this.biscuits = `hlll`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw and reveal a {3}. If it is yello, return all cards in your hand. If it is green, unsplay all your stacks. If it is red, return all cards in your score pile. If it is blue, draw a {9}.`
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
