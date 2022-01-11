const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Holy Lance`  // Card names are unique in Innovation
  this.name = `Holy Lance`
  this.color = `purple`
  this.age = 2
  this.expansion = `arti`
  this.biscuits = `klhk`
  this.dogmaBiscuit = `k`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I compel you to transfer a top Artifact from your board to my board!`,
    `If Holy Grail is a top card on your board, you win.`
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
