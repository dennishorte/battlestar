const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Excalibur`  // Card names are unique in Innovation
  this.name = `Excalibur`
  this.color = `red`
  this.age = 3
  this.expansion = `arti`
  this.biscuits = `chkk`
  this.dogmaBiscuit = `k`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I compel your to transfer a top card of higher value than my top card of the same color from your board to my board!`
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
